#include "ifc_entity.h"

#include <cmath>
#include <initializer_list>
#include <limits>
#include <unordered_set>

#include "../web-ifc/parsing/IfcLoader.h"
#include "../web-ifc/schema/IfcSchemaManager.h"
#include "../web-ifc/schema/ifc-schema.h"

namespace brep::ifc {

namespace {

struct Row {
  const char* schema;
  uint32_t code;
  const char* name;
  std::initializer_list<const char*> attrs;
  std::initializer_list<const char*> ancestors;
};

// Constant data, not a constructor: built from std::vector this table compiled to one 716 KB
// wasm function, which the engine had to compile before the first product was built.
constexpr Row kRows[] = {
#include "ifc_attr_names.inc"
};

const auto& rows() { return kRows; }

struct Table {
  // schema -> code -> info
  std::unordered_map<std::string, std::unordered_map<uint32_t, TypeInfo>> bySchema;
  // schema -> class name -> code
  std::unordered_map<std::string, std::unordered_map<std::string, uint32_t>> codeOf;
};

const Table& table() {
  static const Table t = [] {
    Table t;
    for (const Row& row : rows()) {
      TypeInfo info;
      info.name = row.name;
      int i = 0;
      for (const char* a : row.attrs) {
        info.attrs.emplace_back(a);
        info.indexOf.emplace(a, i++);
      }
      for (const char* a : row.ancestors) info.ancestors.emplace_back(a);
      t.bySchema[row.schema].emplace(row.code, std::move(info));
      t.codeOf[row.schema].emplace(row.name, row.code);
    }
    return t;
  }();
  return t;
}

}  // namespace

const TypeInfo* typeInfoStrict(std::string_view schema, uint32_t code) {
  const Table& t = table();
  auto s = t.bySchema.find(std::string(schema));
  if (s == t.bySchema.end()) return nullptr;
  auto it = s->second.find(code);
  return it == s->second.end() ? nullptr : &it->second;
}

const TypeInfo* typeInfo(std::string_view schema, uint32_t code) {
  const Table& t = table();
  auto s = t.bySchema.find(std::string(schema));
  if (s != t.bySchema.end()) {
    auto it = s->second.find(code);
    if (it != s->second.end()) return &it->second;
  }
  // An entity of another schema written into this file (IFC4 curves in IFC2X3 files are common).
  for (const char* other : {"IFC4X3", "IFC4", "IFC2X3"}) {
    auto o = t.bySchema.find(other);
    if (o == t.bySchema.end()) continue;
    auto it = o->second.find(code);
    if (it != o->second.end()) return &it->second;
  }
  return nullptr;
}

double Value::number() const {
  if (kind == Kind::Number) return num;
  if (kind == Kind::Typed && !list.empty()) return list[0].number();
  return std::numeric_limits<double>::quiet_NaN();
}

const std::string& Value::text() const {
  static const std::string empty;
  if (kind == Kind::String || kind == Kind::Enum) return str;
  if (kind == Kind::Typed && !list.empty()) return list[0].text();
  return empty;
}

const std::vector<Value>& Value::items() const {
  static const std::vector<Value> none;
  return kind == Kind::List ? list : none;
}

const Value& Value::null() {
  static const Value v;
  return v;
}

const Value& Entity::get(std::string_view name) const {
  if (!info) return Value::null();
  auto it = info->indexOf.find(name);
  if (it == info->indexOf.end() || it->second >= (int)args.size()) return Value::null();
  return args[it->second];
}

std::string_view Entity::kind() const { return info ? std::string_view(info->name) : std::string_view(); }

bool Entity::isA(std::string_view name) const {
  if (!info) return false;
  if (info->name == name) return true;
  for (const auto& a : info->ancestors) if (a == name) return true;
  return false;
}

namespace {

using webifc::parsing::IfcTokenType;

Value readArgs(webifc::parsing::IfcLoader& L, const webifc::schema::IfcSchemaManager& S, bool inObject, bool inList);

Value readScalar(webifc::parsing::IfcLoader& L, IfcTokenType t) {
  Value v;
  switch (t) {
    case IfcTokenType::STRING: v.kind = Value::Kind::String; v.str = L.GetDecodedStringArgument(); break;
    case IfcTokenType::ENUM: {
      std::string_view s = L.GetStringArgument();
      if (s == "T") { v.kind = Value::Kind::Bool; v.flag = true; }
      else if (s == "F") { v.kind = Value::Kind::Bool; v.flag = false; }
      else if (s == "U") { v.kind = Value::Kind::Null; }
      else { v.kind = Value::Kind::Enum; v.str = std::string(s); }
      break;
    }
    case IfcTokenType::REAL: v.kind = Value::Kind::Number; v.num = L.GetDoubleArgument(); break;
    case IfcTokenType::INTEGER: v.kind = Value::Kind::Number; v.num = (double)L.GetIntArgument(); break;
    case IfcTokenType::REF: v.kind = Value::Kind::Ref; v.ref = L.GetRefArgument(); break;
    default: break;
  }
  return v;
}

// Same walk as web-ifc's GetArgs, building Values instead of JS objects.
Value readArgs(webifc::parsing::IfcLoader& L, const webifc::schema::IfcSchemaManager& S, bool inObject, bool inList) {
  Value out;
  out.kind = Value::Kind::List;
  // Entity rows and coordinate triples are the common shapes; growing moves every Value.
  if (!inObject) out.list.reserve(inList ? 3 : 8);
  bool end = false;
  while (!L.IsAtEnd() && !end) {
    IfcTokenType t = L.GetTokenType();
    switch (t) {
      case IfcTokenType::LINE_END: end = true; break;
      case IfcTokenType::EMPTY: out.list.emplace_back(); break;
      case IfcTokenType::SET_BEGIN: out.list.push_back(readArgs(L, S, false, true)); break;
      case IfcTokenType::SET_END: end = true; break;
      case IfcTokenType::LABEL: {
        L.StepBack();
        std::string_view s = L.GetStringArgument();
        Value typed;
        typed.kind = Value::Kind::Typed;
        typed.typeCode = S.IfcTypeToTypeCode(s);
        L.GetTokenType();  // the set open
        Value inner = readArgs(L, S, true, false);
        typed.list.push_back(std::move(inner));
        out.list.push_back(std::move(typed));
        break;
      }
      case IfcTokenType::STRING:
      case IfcTokenType::ENUM:
      case IfcTokenType::REAL:
      case IfcTokenType::INTEGER:
      case IfcTokenType::REF:
        L.StepBack();
        out.list.push_back(readScalar(L, t));
        break;
      default: break;
    }
  }
  if (out.list.empty() && !inList) return Value();
  if (out.list.size() == 1 && inObject) { Value one = std::move(out.list[0]); return one; }
  return out;
}

}  // namespace

// The schema web-ifc's JS API reads a file with (its SchemaNames groups), from the FILE_SCHEMA name.
// IfcLoader::GetSchema knows only the exact names and falls back to IFC2X3 (e.g. for IFC4X1).
static std::string schemaOfFile(webifc::parsing::IfcLoader& l) {
  std::string name;
  auto lines = l.GetHeaderLinesWithType(webifc::schema::FILE_SCHEMA);
  if (!lines.empty()) {
    l.MoveToHeaderLineArgument(lines[0], 0);
    while (!l.IsAtEnd()) {
      IfcTokenType t = l.GetTokenType();
      if (t == IfcTokenType::LINE_END) break;
      if (t == IfcTokenType::LABEL || t == IfcTokenType::STRING) {
        l.StepBack();
        name = std::string(l.GetStringArgument());
        break;
      }
    }
  }
  for (char& c : name) if (c >= 'a' && c <= 'z') c = char(c - 'a' + 'A');
  if (name == "IFC2X3" || name == "IFC2X_FINAL") return "IFC2X3";
  if (name == "IFC4") return "IFC4";
  if (name.rfind("IFC4X", 0) == 0) return "IFC4X3";
  switch (l.GetSchema()) {
    case IFC4: return "IFC4";
    case IFC2X3: return "IFC2X3";
    default: return "IFC4X3";
  }
}

Model::Model(webifc::parsing::IfcLoader& l, const webifc::schema::IfcSchemaManager& s) : loader(l), schemas(s) {
  schemaName = schemaOfFile(l);
}

// Keyed by express id in a hash map, not a vector sized to the largest id: a part cut out of a big
// file keeps its original ids (36 million on one), and a dense table of them was 330 MB of empty
// slots before a single line was read.
const Entity* Model::line(uint32_t id) {
  auto found = cache.find(id);
  if (found != cache.end()) { hits++; return found->second.get(); }
  misses++;
  std::unique_ptr<Entity> e;
  if (loader.IsValidExpressID(id)) {
    uint32_t type = loader.GetLineType(id);
    if (type != 0) {
      e = std::make_unique<Entity>();
      e->id = id;
      e->type = type;
      auto k = kinds.find(type);
      if (k == kinds.end()) {
        const TypeInfo* info = typeInfo(schemaName, type);
        k = kinds.emplace(type, Kind{info, info && !typeInfoStrict(schemaName, type)}).first;
      }
      e->info = k->second.info;
      e->foreign = k->second.foreign;
      loader.MoveToArgumentOffset(id, 0);
      Value args = readArgs(loader, schemas, false, false);
      e->args = std::move(args.list);
    }
  }
  const Entity* raw = e.get();
  if (e) live++;
  cache.emplace(id, std::move(e));
  return raw;
}

// Faceted solids are millions of IFCCARTESIANPOINT lines read through the Entity path (a Value list
// per point, an attribute looked up by name): the coordinates alone, in a table of their own.
bool Model::coords(uint32_t id, double out[3], int& n) {
  int32_t at = tripleAt.get(id);
  if (at < 0) {
    Triple tr{{0, 0, 0}, -1};
    if (loader.IsValidExpressID(id)) {
      const uint32_t type = loader.GetLineType(id);
      if (type == webifc::schema::IFCCARTESIANPOINT || type == webifc::schema::IFCDIRECTION) {
        loader.MoveToArgumentOffset(id, 0);
        if (loader.GetTokenType() == IfcTokenType::SET_BEGIN) {
          int8_t k = 0;
          bool ok = true;
          while (!loader.IsAtEnd()) {
            const IfcTokenType t = loader.GetTokenType();
            if (t == IfcTokenType::SET_END) break;
            double v;
            if (t == IfcTokenType::REAL) { loader.StepBack(); v = loader.GetDoubleArgument(); }
            else if (t == IfcTokenType::INTEGER) { loader.StepBack(); v = (double)loader.GetIntArgument(); }
            else { ok = false; break; }
            if (!std::isfinite(v)) { ok = false; break; }
            if (k < 3) tr.v[k] = v;
            if (k < 100) k++;
          }
          if (ok && k > 0) tr.n = k;
        }
      }
    }
    bool inserted = false;
    at = tripleAt.getOrInsert(id, (int32_t)tripleStore.size(), inserted);
    tripleStore.push_back(tr);
  }
  const Triple& found = tripleStore[(size_t)at];
  if (found.n < 0) return false;
  out[0] = found.v[0];
  out[1] = found.v[1];
  out[2] = found.v[2];
  n = found.n;
  return true;
}

bool Model::refList(uint32_t id, std::vector<uint32_t>& out, uint32_t& type) {
  out.clear();
  type = 0;
  if (!loader.IsValidExpressID(id)) return false;
  type = loader.GetLineType(id);
  if (type == 0) return false;
  loader.MoveToArgumentOffset(id, 0);
  if (loader.GetTokenType() != IfcTokenType::SET_BEGIN) return false;
  while (!loader.IsAtEnd()) {
    const IfcTokenType t = loader.GetTokenType();
    if (t == IfcTokenType::SET_END) return true;
    if (t != IfcTokenType::REF) return false;
    loader.StepBack();
    out.push_back(loader.GetRefArgument());
  }
  return false;
}

bool Model::faceBound(uint32_t id, uint32_t& loop, bool& orientation, bool& outer) {
  if (!loader.IsValidExpressID(id)) return false;
  const uint32_t type = loader.GetLineType(id);
  if (type != webifc::schema::IFCFACEBOUND && type != webifc::schema::IFCFACEOUTERBOUND) return false;
  outer = type == webifc::schema::IFCFACEOUTERBOUND;
  loader.MoveToArgumentOffset(id, 0);
  if (loader.GetTokenType() != IfcTokenType::REF) return false;
  loader.StepBack();
  loop = loader.GetRefArgument();
  orientation = true;
  const IfcTokenType t = loader.GetTokenType();
  if (t == IfcTokenType::ENUM) {
    loader.StepBack();
    orientation = loader.GetStringArgument() != "F";
  }
  return true;
}

void Model::trim(size_t limit) {
  if (tripleStore.size() > 4 * limit) {
    detail::ProbeMap<uint32_t>().swap(tripleAt);
    std::vector<Triple>().swap(tripleStore);
  }
  if (live <= limit) return;
  std::unordered_map<uint32_t, std::unique_ptr<Entity>>().swap(cache);
  live = 0;
}

namespace {
struct InheritRow {
  const char* schema;
  uint32_t code;
  std::vector<uint32_t> subtypes;
};
// web-ifc's InheritanceDef: subtypes in the order its GetLineIDsWithType(type, true) visits them.
const std::unordered_map<std::string, std::unordered_map<uint32_t, const std::vector<uint32_t>*>>& inheritance() {
  static const std::vector<InheritRow> rows = {
#include "ifc_entity_inherit.inc"
  };
  static const auto byKey = [] {
    std::unordered_map<std::string, std::unordered_map<uint32_t, const std::vector<uint32_t>*>> m;
    for (const InheritRow& r : rows) m[r.schema][r.code] = &r.subtypes;
    return m;
  }();
  return byKey;
}
}  // namespace

std::vector<uint32_t> Model::idsWithType(uint32_t type, bool inherited) const {
  std::vector<uint32_t> out = loader.GetExpressIDsWithType(type);
  if (!inherited) return out;
  const auto& all = inheritance();
  auto s = all.find(schemaName);
  if (s == all.end()) return out;
  auto subs = s->second.find(type);
  if (subs == s->second.end()) return out;
  for (uint32_t code : *subs->second) {
    auto more = loader.GetExpressIDsWithType(code);
    out.insert(out.end(), more.begin(), more.end());
  }
  return out;
}

std::string Model::typeName(uint32_t code) const { return schemas.IfcTypeCodeToType(code); }

}  // namespace brep::ifc
