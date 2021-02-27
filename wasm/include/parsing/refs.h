/*

		void GetRefs(uint32_t id, std::unordered_map<uint32_t, std::vector<uint32_t>>& refs, std::set<uint32_t>& items)
		{
			items.insert(id);
			auto refsForId = refs[id];
			for (auto& ref : refsForId)
			{
				GetRefs(ref, refs, items);
			}
		}

		void GetRefsForLine(std::vector<uint32_t>& refs)
		{
			bool first = true;
			while (!_tape.AtEnd())
			{
				IfcTokenType t = static_cast<IfcTokenType>(_tape.Read<char>());

				switch (t)
				{
				case IfcTokenType::LINE_END:
				{
					return;
					break;
				}
				case IfcTokenType::UNKNOWN:
				case IfcTokenType::EMPTY:
				case IfcTokenType::SET_BEGIN:
				case IfcTokenType::SET_END:
					break;
				case IfcTokenType::STRING:
				case IfcTokenType::ENUM:
				{
					uint8_t length = _tape.Read<uint8_t>();
					_tape.AdvanceRead(length);
					break;
				}
				case IfcTokenType::REF:
				{
					uint32_t ref = _tape.Read<uint32_t>();
					if (!first)
					{
						refs.push_back(ref);
					}
					else
					{
						first = false;
					}
					break;
				}
				case IfcTokenType::REAL:
				{
					_tape.Read<double>();
					break;
				}
				default:
					break;
				}
			}
		}

		std::unordered_map<uint32_t, std::vector<uint32_t>> GetRefs()
		{
			std::unordered_map<uint32_t, std::vector<uint32_t>> refs;

			for (auto& line : lines)
			{
				_tape.MoveTo(line.tapeOffset);
				GetRefsForLine(refs[line.expressID]);
			}

			return refs;
		}

		void GetAllRefs(std::set<uint32_t>& refs, uint32_t start)
		{
			auto result = refs.insert(start);
			if (!result.second)
			{
				return;
			}

			_tape.MoveTo(lines[expressIDToLine[start]].tapeOffset);

			std::vector<uint32_t> r;
			GetRefsForLine(r);

			auto material = _metaData._relMaterials.find(start);
			if (material != _metaData._relMaterials.end())
			{
				auto& materials = material->second;
				for (auto item : materials)
				{
					if (item.first != start) GetAllRefs(refs, item.first);
					GetAllRefs(refs, item.second);

					if (_metaData._materialDefinitions.count(item.second) != 0)
					{
						auto& defs = _materialDefinitions[item.second];
						for (auto def : defs)
						{
							if (def.first != start) GetAllRefs(refs, def.first);
							GetAllRefs(refs, def.second);
						}
					}
				}
			}

			auto styledItem = _styledItems.find(start);
			if (styledItem != _styledItems.end())
			{
				auto items = styledItem->second;
				for (auto item : items)
				{
					if (item.first != start) GetAllRefs(refs, item.first);
					GetAllRefs(refs, item.second);
				}
			}

			for (auto& ref : r)
			{
				GetAllRefs(refs, ref);
			}
		}

*/