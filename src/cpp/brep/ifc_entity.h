#pragma once
// A named-field view of IFC lines on top of web-ifc's tape, so the IFC reader can be ported from the
// TypeScript one access for access (`entity.get("SweptArea")` where TS wrote `entity.SweptArea`).

#include <cstdint>
#include <string>
#include <string_view>
#include <unordered_map>
#include <vector>
#include <memory>
#include "topology.h"

namespace webifc::parsing { class IfcLoader; }
namespace webifc::schema { class IfcSchemaManager; }

namespace brep::ifc {

/** One argument value. Mirrors what web-ifc's typed GetLine hands to JS. */
struct Value {
  enum class Kind : uint8_t { Null, Number, String, Enum, Bool, Ref, List, Typed };
  Kind kind = Kind::Null;
  double num = 0;          // Number
  uint32_t ref = 0;        // Ref
  bool flag = false;       // Bool
  uint32_t typeCode = 0;   // Typed: the defined type, e.g. IFCPARAMETERVALUE
  std::string str;         // String / Enum (enum without dots)
  std::vector<Value> list; // List items; Typed: list[0] is the inner value

  bool isNull() const { return kind == Kind::Null; }
  bool isRef() const { return kind == Kind::Ref; }
  bool isList() const { return kind == Kind::List; }
  bool isNumber() const { return kind == Kind::Number || (kind == Kind::Typed && !list.empty() && list[0].kind == Kind::Number); }
  /** The number, unwrapping a typed value; NaN when there is none (TS `asPlainNumber`). */
  double number() const;
  /** The referenced id, or 0 (TS `asHandle` returning null). */
  uint32_t handle() const { return kind == Kind::Ref ? ref : 0; }
  /** String/enum text, unwrapping a typed value. */
  const std::string& text() const;
  /** List items (empty for non-lists). */
  const std::vector<Value>& items() const;
  static const Value& null();
};

// Lets a map keyed by std::string be searched with a string_view, without building a string.
struct TextHash {
  using is_transparent = void;
  size_t operator()(std::string_view s) const { return std::hash<std::string_view>{}(s); }
};

struct TypeInfo {
  std::string name;                                  // "IfcExtrudedAreaSolid"
  std::vector<std::string> attrs;                    // attribute names in argument order
  std::vector<std::string> ancestors;                // parent first
  std::unordered_map<std::string, int, TextHash, std::equal_to<>> indexOf;  // name -> argument index
};

struct Entity {
  uint32_t id = 0;
  uint32_t type = 0;
  const TypeInfo* info = nullptr;  // null for a type the table does not know
  bool foreign = false;            // type found only in another schema than the file's
  std::vector<Value> args;
  /** Attribute by name; Value::null() when absent. */
  const Value& get(std::string_view name) const;
  /** Class name, "" when unknown (TS `ifcKindOf`). */
  std::string_view kind() const;
  /** True when the class is `name` or derives from it. */
  bool isA(std::string_view name) const;
};

/** One opened model. Every line read at most once (TS `cachingReader`). */
class Model {
public:
  Model(webifc::parsing::IfcLoader& loader, const webifc::schema::IfcSchemaManager& schemas);
  /** The entity, or nullptr for an id that is not a line. */
  const Entity* line(uint32_t id);
  /** Ids of every line of this type (and its subtypes when `inherited`). */
  std::vector<uint32_t> idsWithType(uint32_t type, bool inherited = false) const;
  /** Upper-case schema type name of a code, e.g. "IFCPARAMETERVALUE". */
  std::string typeName(uint32_t code) const;
  /** "IFC2X3", "IFC4" or "IFC4X3". */
  const std::string& schema() const { return schemaName; }
  /** Drop every cached line once more than `limit` are held; the next lookups read them again.
   *  Only between products, when nothing holds an Entity pointer. Read whole, a 71 MB part kept
   *  every line alive: 2.2 GB against web-ifc's 0.84. */
  void trim(size_t limit);
  /** A point or direction read straight from its tokens (no Entity): false if the id is neither
   *  or a coordinate is not a finite number, and the caller reads it the general way. */
  bool coords(uint32_t id, double out[3], int& n);
  /** The first argument of a line as a list of references (a polyloop's points, a face's bounds,
   *  a shell's faces), read from its tokens and not cached; false if it is not such a list. */
  bool refList(uint32_t id, std::vector<uint32_t>& out, uint32_t& type);
  /** An IFCFACEBOUND / IFCFACEOUTERBOUND: its loop and orientation (true unless .F.). */
  bool faceBound(uint32_t id, uint32_t& loop, bool& orientation, bool& outer);
  uint64_t hits = 0, misses = 0;
  webifc::parsing::IfcLoader& loader;
private:
  const webifc::schema::IfcSchemaManager& schemas;
  // By express id; an id looked up that is not a line stays as nullptr.
  std::unordered_map<uint32_t, std::unique_ptr<Entity>> cache;
  size_t live = 0;
  struct Triple { double v[3]; int8_t n; };  // n < 0: not a point or direction
  // id -> index into tripleStore: open addressing, no allocation per point (millions of them).
  detail::ProbeMap<uint32_t> tripleAt;
  std::vector<Triple> tripleStore;
  struct Kind { const TypeInfo* info; bool foreign; };
  std::unordered_map<uint32_t, Kind> kinds;
  std::string schemaName;
};

/** Lookup of a type in the generated table: the file's schema first, then any other. */
const TypeInfo* typeInfo(std::string_view schema, uint32_t code);
/** Lookup in exactly this schema; nullptr when the schema has no such type. */
const TypeInfo* typeInfoStrict(std::string_view schema, uint32_t code);

}  // namespace brep::ifc
