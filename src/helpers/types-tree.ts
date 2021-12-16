export interface TreeNode{
    "name": string;
    "id": number;
    "children"?: TreeNode[];
}

export const IfcTypesTree: TreeNode = {
	"children": [
		{
			"children": [
				{
					"children": [
						{
							"name": "IfcProject",
							"id": 103090709
						},
						{
							"name": "IfcProjectLibrary",
							"id": 653396225
						}
					],
					"name": "IfcContext",
					"id": 3419103109
				},
				{
					"children": [
						{
							"children": [
								{
									"name": "IfcOccupant",
									"id": 4143007308
								}
							],
							"name": "IfcActor",
							"id": 2296667514
						},
						{
							"children": [
								{
									"name": "IfcActionRequest",
									"id": 3821786052
								},
								{
									"name": "IfcCostItem",
									"id": 3895139033
								},
								{
									"name": "IfcCostSchedule",
									"id": 1419761937
								},
								{
									"name": "IfcPerformanceHistory",
									"id": 2382730787
								},
								{
									"name": "IfcPermit",
									"id": 3327091369
								},
								{
									"name": "IfcProjectOrder",
									"id": 2904328755
								},
								{
									"name": "IfcWorkCalendar",
									"id": 4088093105
								},
								{
									"children": [
										{
											"name": "IfcWorkPlan",
											"id": 4218914973
										},
										{
											"name": "IfcWorkSchedule",
											"id": 3342526732
										}
									],
									"name": "IfcWorkControl",
									"id": 1028945134
								}
							],
							"name": "IfcControl",
							"id": 3293443760
						},
						{
							"children": [
								{
									"name": "IfcAsset",
									"id": 3460190687
								},
								{
									"name": "IfcInventory",
									"id": 2391368822
								},
								{
									"children": [
										{
											"name": "IfcStructuralLoadCase",
											"id": 385403989
										}
									],
									"name": "IfcStructuralLoadGroup",
									"id": 1252848954
								},
								{
									"name": "IfcStructuralResultGroup",
									"id": 2986769608
								},
								{
									"children": [
										{
											"name": "IfcBuildingSystem",
											"id": 1177604601
										},
										{
											"children": [
												{
													"name": "IfcDistributionCircuit",
													"id": 562808652
												}
											],
											"name": "IfcDistributionSystem",
											"id": 3205830791
										},
										{
											"name": "IfcStructuralAnalysisModel",
											"id": 2515109513
										},
										{
											"name": "IfcZone",
											"id": 1033361043
										}
									],
									"name": "IfcSystem",
									"id": 2254336722
								}
							],
							"name": "IfcGroup",
							"id": 2706460486
						},
						{
							"children": [
								{
									"name": "IfcEvent",
									"id": 4148101412
								},
								{
									"name": "IfcProcedure",
									"id": 2744685151
								},
								{
									"name": "IfcTask",
									"id": 3473067441
								}
							],
							"name": "IfcProcess",
							"id": 2945172077
						},
						{
							"children": [
								{
									"name": "IfcAnnotation",
									"id": 1674181508
								},
								{
									"children": [
										{
											"children": [
												{
													"children": [
														{
															"name": "IfcBeamStandardCase",
															"id": 2906023776
														}
													],
													"name": "IfcBeam",
													"id": 753842376
												},
												{
													"name": "IfcBuildingElementProxy",
													"id": 1095909175
												},
												{
													"name": "IfcChimney",
													"id": 3296154744
												},
												{
													"children": [
														{
															"name": "IfcColumnStandardCase",
															"id": 905975707
														}
													],
													"name": "IfcColumn",
													"id": 843113511
												},
												{
													"name": "IfcCovering",
													"id": 1973544240
												},
												{
													"name": "IfcCurtainWall",
													"id": 3495092785
												},
												{
													"children": [
														{
															"name": "IfcDoorStandardCase",
															"id": 3242481149
														}
													],
													"name": "IfcDoor",
													"id": 395920057
												},
												{
													"name": "IfcFooting",
													"id": 900683007
												},
												{
													"children": [
														{
															"name": "IfcMemberStandardCase",
															"id": 1911478936
														}
													],
													"name": "IfcMember",
													"id": 1073191201
												},
												{
													"name": "IfcPile",
													"id": 1687234759
												},
												{
													"children": [
														{
															"name": "IfcPlateStandardCase",
															"id": 1156407060
														}
													],
													"name": "IfcPlate",
													"id": 3171933400
												},
												{
													"name": "IfcRailing",
													"id": 2262370178
												},
												{
													"name": "IfcRamp",
													"id": 3024970846
												},
												{
													"name": "IfcRampFlight",
													"id": 3283111854
												},
												{
													"name": "IfcRoof",
													"id": 2016517767
												},
												{
													"name": "IfcShadingDevice",
													"id": 1329646415
												},
												{
													"children": [
														{
															"name": "IfcSlabElementedCase",
															"id": 3127900445
														},
														{
															"name": "IfcSlabStandardCase",
															"id": 3027962421
														}
													],
													"name": "IfcSlab",
													"id": 1529196076
												},
												{
													"name": "IfcStair",
													"id": 331165859
												},
												{
													"name": "IfcStairFlight",
													"id": 4252922144
												},
												{
													"children": [
														{
															"name": "IfcWallElementedCase",
															"id": 4156078855
														},
														{
															"name": "IfcWallStandardCase",
															"id": 3512223829
														}
													],
													"name": "IfcWall",
													"id": 2391406946
												},
												{
													"children": [
														{
															"name": "IfcWindowStandardCase",
															"id": 486154966
														}
													],
													"name": "IfcWindow",
													"id": 3304561284
												}
											],
											"name": "IfcBuildingElement",
											"id": 3299480353
										},
										{
											"name": "IfcCivilElement",
											"id": 1677625105
										},
										{
											"children": [
												{
													"children": [
														{
															"name": "IfcActuator",
															"id": 4288193352
														},
														{
															"name": "IfcAlarm",
															"id": 3087945054
														},
														{
															"name": "IfcController",
															"id": 25142252
														},
														{
															"name": "IfcFlowInstrument",
															"id": 182646315
														},
														{
															"name": "IfcProtectiveDeviceTrippingUnit",
															"id": 2295281155
														},
														{
															"name": "IfcSensor",
															"id": 4086658281
														},
														{
															"name": "IfcUnitaryControlElement",
															"id": 630975310
														}
													],
													"name": "IfcDistributionControlElement",
													"id": 1062813311
												},
												{
													"children": [
														{
															"name": "IfcDistributionChamberElement",
															"id": 1052013943
														},
														{
															"children": [
																{
																	"name": "IfcAirToAirHeatRecovery",
																	"id": 2056796094
																},
																{
																	"name": "IfcBoiler",
																	"id": 32344328
																},
																{
																	"name": "IfcBurner",
																	"id": 2938176219
																},
																{
																	"name": "IfcChiller",
																	"id": 3902619387
																},
																{
																	"name": "IfcCoil",
																	"id": 639361253
																},
																{
																	"name": "IfcCondenser",
																	"id": 2272882330
																},
																{
																	"name": "IfcCooledBeam",
																	"id": 4136498852
																},
																{
																	"name": "IfcCoolingTower",
																	"id": 3640358203
																},
																{
																	"name": "IfcElectricGenerator",
																	"id": 264262732
																},
																{
																	"name": "IfcElectricMotor",
																	"id": 402227799
																},
																{
																	"name": "IfcEngine",
																	"id": 2814081492
																},
																{
																	"name": "IfcEvaporativeCooler",
																	"id": 3747195512
																},
																{
																	"name": "IfcEvaporator",
																	"id": 484807127
																},
																{
																	"name": "IfcHeatExchanger",
																	"id": 3319311131
																},
																{
																	"name": "IfcHumidifier",
																	"id": 2068733104
																},
																{
																	"name": "IfcMotorConnection",
																	"id": 2474470126
																},
																{
																	"name": "IfcSolarDevice",
																	"id": 3420628829
																},
																{
																	"name": "IfcTransformer",
																	"id": 3825984169
																},
																{
																	"name": "IfcTubeBundle",
																	"id": 3026737570
																},
																{
																	"name": "IfcUnitaryEquipment",
																	"id": 4292641817
																}
															],
															"name": "IfcEnergyConversionDevice",
															"id": 1658829314
														},
														{
															"children": [
																{
																	"name": "IfcAirTerminalBox",
																	"id": 177149247
																},
																{
																	"name": "IfcDamper",
																	"id": 4074379575
																},
																{
																	"name": "IfcElectricDistributionBoard",
																	"id": 862014818
																},
																{
																	"name": "IfcElectricTimeControl",
																	"id": 1003880860
																},
																{
																	"name": "IfcFlowMeter",
																	"id": 2188021234
																},
																{
																	"name": "IfcProtectiveDevice",
																	"id": 738039164
																},
																{
																	"name": "IfcSwitchingDevice",
																	"id": 1162798199
																},
																{
																	"name": "IfcValve",
																	"id": 4207607924
																}
															],
															"name": "IfcFlowController",
															"id": 2058353004
														},
														{
															"children": [
																{
																	"name": "IfcCableCarrierFitting",
																	"id": 635142910
																},
																{
																	"name": "IfcCableFitting",
																	"id": 1051757585
																},
																{
																	"name": "IfcDuctFitting",
																	"id": 342316401
																},
																{
																	"name": "IfcJunctionBox",
																	"id": 2176052936
																},
																{
																	"name": "IfcPipeFitting",
																	"id": 310824031
																}
															],
															"name": "IfcFlowFitting",
															"id": 4278956645
														},
														{
															"children": [
																{
																	"name": "IfcCompressor",
																	"id": 3571504051
																},
																{
																	"name": "IfcFan",
																	"id": 3415622556
																},
																{
																	"name": "IfcPump",
																	"id": 90941305
																}
															],
															"name": "IfcFlowMovingDevice",
															"id": 3132237377
														},
														{
															"children": [
																{
																	"name": "IfcCableCarrierSegment",
																	"id": 3758799889
																},
																{
																	"name": "IfcCableSegment",
																	"id": 4217484030
																},
																{
																	"name": "IfcDuctSegment",
																	"id": 3518393246
																},
																{
																	"name": "IfcPipeSegment",
																	"id": 3612865200
																}
															],
															"name": "IfcFlowSegment",
															"id": 987401354
														},
														{
															"children": [
																{
																	"name": "IfcElectricFlowStorageDevice",
																	"id": 3310460725
																},
																{
																	"name": "IfcTank",
																	"id": 812556717
																}
															],
															"name": "IfcFlowStorageDevice",
															"id": 707683696
														},
														{
															"children": [
																{
																	"name": "IfcAirTerminal",
																	"id": 1634111441
																},
																{
																	"name": "IfcAudioVisualAppliance",
																	"id": 277319702
																},
																{
																	"name": "IfcCommunicationsAppliance",
																	"id": 3221913625
																},
																{
																	"name": "IfcElectricAppliance",
																	"id": 1904799276
																},
																{
																	"name": "IfcFireSuppressionTerminal",
																	"id": 1426591983
																},
																{
																	"name": "IfcLamp",
																	"id": 76236018
																},
																{
																	"name": "IfcLightFixture",
																	"id": 629592764
																},
																{
																	"name": "IfcMedicalDevice",
																	"id": 1437502449
																},
																{
																	"name": "IfcOutlet",
																	"id": 3694346114
																},
																{
																	"name": "IfcSanitaryTerminal",
																	"id": 3053780830
																},
																{
																	"name": "IfcSpaceHeater",
																	"id": 1999602285
																},
																{
																	"name": "IfcStackTerminal",
																	"id": 1404847402
																},
																{
																	"name": "IfcWasteTerminal",
																	"id": 4237592921
																}
															],
															"name": "IfcFlowTerminal",
															"id": 2223149337
														},
														{
															"children": [
																{
																	"name": "IfcDuctSilencer",
																	"id": 1360408905
																},
																{
																	"name": "IfcFilter",
																	"id": 819412036
																},
																{
																	"name": "IfcInterceptor",
																	"id": 4175244083
																}
															],
															"name": "IfcFlowTreatmentDevice",
															"id": 3508470533
														}
													],
													"name": "IfcDistributionFlowElement",
													"id": 3040386961
												}
											],
											"name": "IfcDistributionElement",
											"id": 1945004755
										},
										{
											"name": "IfcElementAssembly",
											"id": 4123344466
										},
										{
											"children": [
												{
													"name": "IfcBuildingElementPart",
													"id": 2979338954
												},
												{
													"name": "IfcDiscreteAccessory",
													"id": 1335981549
												},
												{
													"name": "IfcFastener",
													"id": 647756555
												},
												{
													"name": "IfcMechanicalFastener",
													"id": 377706215
												},
												{
													"children": [
														{
															"name": "IfcReinforcingBar",
															"id": 979691226
														},
														{
															"name": "IfcReinforcingMesh",
															"id": 2320036040
														},
														{
															"name": "IfcTendon",
															"id": 3824725483
														},
														{
															"name": "IfcTendonAnchor",
															"id": 2347447852
														}
													],
													"name": "IfcReinforcingElement",
													"id": 3027567501
												},
												{
													"name": "IfcVibrationIsolator",
													"id": 2391383451
												}
											],
											"name": "IfcElementComponent",
											"id": 1623761950
										},
										{
											"children": [
												{
													"children": [
														{
															"name": "IfcProjectionElement",
															"id": 3651124850
														}
													],
													"name": "IfcFeatureElementAddition",
													"id": 2143335405
												},
												{
													"children": [
														{
															"children": [
																{
																	"name": "IfcOpeningStandardCase",
																	"id": 3079942009
																}
															],
															"name": "IfcOpeningElement",
															"id": 3588315303
														},
														{
															"name": "IfcVoidingFeature",
															"id": 926996030
														}
													],
													"name": "IfcFeatureElementSubtraction",
													"id": 1287392070
												},
												{
													"name": "IfcSurfaceFeature",
													"id": 3101698114
												}
											],
											"name": "IfcFeatureElement",
											"id": 2827207264
										},
										{
											"children": [
												{
													"name": "IfcFurniture",
													"id": 1509553395
												},
												{
													"name": "IfcSystemFurnitureElement",
													"id": 413509423
												}
											],
											"name": "IfcFurnishingElement",
											"id": 263784265
										},
										{
											"name": "IfcGeographicElement",
											"id": 3493046030
										},
										{
											"name": "IfcTransportElement",
											"id": 1620046519
										},
										{
											"name": "IfcVirtualElement",
											"id": 2769231204
										}
									],
									"name": "IfcElement",
									"id": 1758889154
								},
								{
									"name": "IfcGrid",
									"id": 3009204131
								},
								{
									"children": [
										{
											"name": "IfcDistributionPort",
											"id": 3041715199
										}
									],
									"name": "IfcPort",
									"id": 3740093272
								},
								{
									"name": "IfcProxy",
									"id": 3219374653
								},
								{
									"children": [
										{
											"children": [
												{
													"name": "IfcExternalSpatialElement",
													"id": 1209101575
												}
											],
											"name": "IfcExternalSpatialStructureElement",
											"id": 2853485674
										},
										{
											"children": [
												{
													"name": "IfcBuilding",
													"id": 4031249490
												},
												{
													"name": "IfcBuildingStorey",
													"id": 3124254112
												},
												{
													"name": "IfcSite",
													"id": 4097777520
												},
												{
													"name": "IfcSpace",
													"id": 3856911033
												}
											],
											"name": "IfcSpatialStructureElement",
											"id": 2706606064
										},
										{
											"name": "IfcSpatialZone",
											"id": 463610769
										}
									],
									"name": "IfcSpatialElement",
									"id": 1412071761
								},
								{
									"children": [
										{
											"children": [
												{
													"children": [
														{
															"name": "IfcStructuralLinearAction",
															"id": 1807405624
														}
													],
													"name": "IfcStructuralCurveAction",
													"id": 1004757350
												},
												{
													"name": "IfcStructuralPointAction",
													"id": 2082059205
												},
												{
													"children": [
														{
															"name": "IfcStructuralPlanarAction",
															"id": 1621171031
														}
													],
													"name": "IfcStructuralSurfaceAction",
													"id": 3657597509
												}
											],
											"name": "IfcStructuralAction",
											"id": 682877961
										},
										{
											"children": [
												{
													"name": "IfcStructuralCurveReaction",
													"id": 2757150158
												},
												{
													"name": "IfcStructuralPointReaction",
													"id": 1235345126
												},
												{
													"name": "IfcStructuralSurfaceReaction",
													"id": 603775116
												}
											],
											"name": "IfcStructuralReaction",
											"id": 3689010777
										}
									],
									"name": "IfcStructuralActivity",
									"id": 3544373492
								},
								{
									"children": [
										{
											"children": [
												{
													"name": "IfcStructuralCurveConnection",
													"id": 4243806635
												},
												{
													"name": "IfcStructuralPointConnection",
													"id": 734778138
												},
												{
													"name": "IfcStructuralSurfaceConnection",
													"id": 1975003073
												}
											],
											"name": "IfcStructuralConnection",
											"id": 1179482911
										},
										{
											"children": [
												{
													"children": [
														{
															"name": "IfcStructuralCurveMemberVarying",
															"id": 2445595289
														}
													],
													"name": "IfcStructuralCurveMember",
													"id": 214636428
												},
												{
													"children": [
														{
															"name": "IfcStructuralSurfaceMemberVarying",
															"id": 2218152070
														}
													],
													"name": "IfcStructuralSurfaceMember",
													"id": 3979015343
												}
											],
											"name": "IfcStructuralMember",
											"id": 530289379
										}
									],
									"name": "IfcStructuralItem",
									"id": 3136571912
								}
							],
							"name": "IfcProduct",
							"id": 4208778838
						},
						{
							"children": [
								{
									"children": [
										{
											"name": "IfcConstructionEquipmentResource",
											"id": 3898045240
										},
										{
											"name": "IfcConstructionMaterialResource",
											"id": 1060000209
										},
										{
											"name": "IfcConstructionProductResource",
											"id": 488727124
										},
										{
											"name": "IfcCrewResource",
											"id": 3295246426
										},
										{
											"name": "IfcLaborResource",
											"id": 3827777499
										},
										{
											"name": "IfcSubContractResource",
											"id": 148013059
										}
									],
									"name": "IfcConstructionResource",
									"id": 2559216714
								}
							],
							"name": "IfcResource",
							"id": 2914609552
						}
					],
					"name": "IfcObject",
					"id": 3888040117
				},
				{
					"children": [
						{
							"children": [
								{
									"name": "IfcEventType",
									"id": 4024345920
								},
								{
									"name": "IfcProcedureType",
									"id": 569719735
								},
								{
									"name": "IfcTaskType",
									"id": 3206491090
								}
							],
							"name": "IfcTypeProcess",
							"id": 3736923433
						},
						{
							"children": [
								{
									"name": "IfcDoorStyle",
									"id": 526551008
								},
								{
									"children": [
										{
											"children": [
												{
													"name": "IfcBeamType",
													"id": 819618141
												},
												{
													"name": "IfcBuildingElementProxyType",
													"id": 1909888760
												},
												{
													"name": "IfcChimneyType",
													"id": 2197970202
												},
												{
													"name": "IfcColumnType",
													"id": 300633059
												},
												{
													"name": "IfcCoveringType",
													"id": 1916426348
												},
												{
													"name": "IfcCurtainWallType",
													"id": 1457835157
												},
												{
													"name": "IfcDoorType",
													"id": 2323601079
												},
												{
													"name": "IfcFootingType",
													"id": 1893162501
												},
												{
													"name": "IfcMemberType",
													"id": 3181161470
												},
												{
													"name": "IfcPileType",
													"id": 1158309216
												},
												{
													"name": "IfcPlateType",
													"id": 4017108033
												},
												{
													"name": "IfcRailingType",
													"id": 2893384427
												},
												{
													"name": "IfcRampFlightType",
													"id": 2324767716
												},
												{
													"name": "IfcRampType",
													"id": 1469900589
												},
												{
													"name": "IfcRoofType",
													"id": 2781568857
												},
												{
													"name": "IfcShadingDeviceType",
													"id": 4074543187
												},
												{
													"name": "IfcSlabType",
													"id": 2533589738
												},
												{
													"name": "IfcStairFlightType",
													"id": 1039846685
												},
												{
													"name": "IfcStairType",
													"id": 338393293
												},
												{
													"name": "IfcWallType",
													"id": 1898987631
												},
												{
													"name": "IfcWindowType",
													"id": 4009809668
												}
											],
											"name": "IfcBuildingElementType",
											"id": 1950629157
										},
										{
											"name": "IfcCivilElementType",
											"id": 3893394355
										},
										{
											"children": [
												{
													"children": [
														{
															"name": "IfcActuatorType",
															"id": 2874132201
														},
														{
															"name": "IfcAlarmType",
															"id": 3001207471
														},
														{
															"name": "IfcControllerType",
															"id": 578613899
														},
														{
															"name": "IfcFlowInstrumentType",
															"id": 4037862832
														},
														{
															"name": "IfcProtectiveDeviceTrippingUnitType",
															"id": 655969474
														},
														{
															"name": "IfcSensorType",
															"id": 1783015770
														},
														{
															"name": "IfcUnitaryControlElementType",
															"id": 3179687236
														}
													],
													"name": "IfcDistributionControlElementType",
													"id": 2063403501
												},
												{
													"children": [
														{
															"name": "IfcDistributionChamberElementType",
															"id": 1599208980
														},
														{
															"children": [
																{
																	"name": "IfcAirToAirHeatRecoveryType",
																	"id": 1871374353
																},
																{
																	"name": "IfcBoilerType",
																	"id": 231477066
																},
																{
																	"name": "IfcBurnerType",
																	"id": 2188180465
																},
																{
																	"name": "IfcChillerType",
																	"id": 2951183804
																},
																{
																	"name": "IfcCoilType",
																	"id": 2301859152
																},
																{
																	"name": "IfcCondenserType",
																	"id": 2816379211
																},
																{
																	"name": "IfcCooledBeamType",
																	"id": 335055490
																},
																{
																	"name": "IfcCoolingTowerType",
																	"id": 2954562838
																},
																{
																	"name": "IfcElectricGeneratorType",
																	"id": 1534661035
																},
																{
																	"name": "IfcElectricMotorType",
																	"id": 1217240411
																},
																{
																	"name": "IfcEngineType",
																	"id": 132023988
																},
																{
																	"name": "IfcEvaporativeCoolerType",
																	"id": 3174744832
																},
																{
																	"name": "IfcEvaporatorType",
																	"id": 3390157468
																},
																{
																	"name": "IfcHeatExchangerType",
																	"id": 1251058090
																},
																{
																	"name": "IfcHumidifierType",
																	"id": 1806887404
																},
																{
																	"name": "IfcMotorConnectionType",
																	"id": 977012517
																},
																{
																	"name": "IfcSolarDeviceType",
																	"id": 1072016465
																},
																{
																	"name": "IfcTransformerType",
																	"id": 1692211062
																},
																{
																	"name": "IfcTubeBundleType",
																	"id": 1600972822
																},
																{
																	"name": "IfcUnitaryEquipmentType",
																	"id": 1911125066
																}
															],
															"name": "IfcEnergyConversionDeviceType",
															"id": 2107101300
														},
														{
															"children": [
																{
																	"name": "IfcAirTerminalBoxType",
																	"id": 1411407467
																},
																{
																	"name": "IfcDamperType",
																	"id": 3961806047
																},
																{
																	"name": "IfcElectricDistributionBoardType",
																	"id": 2417008758
																},
																{
																	"name": "IfcElectricTimeControlType",
																	"id": 712377611
																},
																{
																	"name": "IfcFlowMeterType",
																	"id": 3815607619
																},
																{
																	"name": "IfcProtectiveDeviceType",
																	"id": 1842657554
																},
																{
																	"name": "IfcSwitchingDeviceType",
																	"id": 2315554128
																},
																{
																	"name": "IfcValveType",
																	"id": 728799441
																}
															],
															"name": "IfcFlowControllerType",
															"id": 3907093117
														},
														{
															"children": [
																{
																	"name": "IfcCableCarrierFittingType",
																	"id": 395041908
																},
																{
																	"name": "IfcCableFittingType",
																	"id": 2674252688
																},
																{
																	"name": "IfcDuctFittingType",
																	"id": 869906466
																},
																{
																	"name": "IfcJunctionBoxType",
																	"id": 4288270099
																},
																{
																	"name": "IfcPipeFittingType",
																	"id": 804291784
																}
															],
															"name": "IfcFlowFittingType",
															"id": 3198132628
														},
														{
															"children": [
																{
																	"name": "IfcCompressorType",
																	"id": 3850581409
																},
																{
																	"name": "IfcFanType",
																	"id": 346874300
																},
																{
																	"name": "IfcPumpType",
																	"id": 2250791053
																}
															],
															"name": "IfcFlowMovingDeviceType",
															"id": 1482959167
														},
														{
															"children": [
																{
																	"name": "IfcCableCarrierSegmentType",
																	"id": 3293546465
																},
																{
																	"name": "IfcCableSegmentType",
																	"id": 1285652485
																},
																{
																	"name": "IfcDuctSegmentType",
																	"id": 3760055223
																},
																{
																	"name": "IfcPipeSegmentType",
																	"id": 4231323485
																}
															],
															"name": "IfcFlowSegmentType",
															"id": 1834744321
														},
														{
															"children": [
																{
																	"name": "IfcElectricFlowStorageDeviceType",
																	"id": 3277789161
																},
																{
																	"name": "IfcTankType",
																	"id": 5716631
																}
															],
															"name": "IfcFlowStorageDeviceType",
															"id": 1339347760
														},
														{
															"children": [
																{
																	"name": "IfcAirTerminalType",
																	"id": 3352864051
																},
																{
																	"name": "IfcAudioVisualApplianceType",
																	"id": 1532957894
																},
																{
																	"name": "IfcCommunicationsApplianceType",
																	"id": 400855858
																},
																{
																	"name": "IfcElectricApplianceType",
																	"id": 663422040
																},
																{
																	"name": "IfcFireSuppressionTerminalType",
																	"id": 4222183408
																},
																{
																	"name": "IfcLampType",
																	"id": 1051575348
																},
																{
																	"name": "IfcLightFixtureType",
																	"id": 1161773419
																},
																{
																	"name": "IfcMedicalDeviceType",
																	"id": 1114901282
																},
																{
																	"name": "IfcOutletType",
																	"id": 2837617999
																},
																{
																	"name": "IfcSanitaryTerminalType",
																	"id": 1768891740
																},
																{
																	"name": "IfcSpaceHeaterType",
																	"id": 1305183839
																},
																{
																	"name": "IfcStackTerminalType",
																	"id": 3112655638
																},
																{
																	"name": "IfcWasteTerminalType",
																	"id": 1133259667
																}
															],
															"name": "IfcFlowTerminalType",
															"id": 2297155007
														},
														{
															"children": [
																{
																	"name": "IfcDuctSilencerType",
																	"id": 2030761528
																},
																{
																	"name": "IfcFilterType",
																	"id": 1810631287
																},
																{
																	"name": "IfcInterceptorType",
																	"id": 3946677679
																}
															],
															"name": "IfcFlowTreatmentDeviceType",
															"id": 3009222698
														}
													],
													"name": "IfcDistributionFlowElementType",
													"id": 3849074793
												}
											],
											"name": "IfcDistributionElementType",
											"id": 3256556792
										},
										{
											"name": "IfcElementAssemblyType",
											"id": 2397081782
										},
										{
											"children": [
												{
													"name": "IfcBuildingElementPartType",
													"id": 39481116
												},
												{
													"name": "IfcDiscreteAccessoryType",
													"id": 2635815018
												},
												{
													"name": "IfcFastenerType",
													"id": 2489546625
												},
												{
													"name": "IfcMechanicalFastenerType",
													"id": 2108223431
												},
												{
													"children": [
														{
															"name": "IfcReinforcingBarType",
															"id": 2572171363
														},
														{
															"name": "IfcReinforcingMeshType",
															"id": 2310774935
														},
														{
															"name": "IfcTendonAnchorType",
															"id": 3081323446
														},
														{
															"name": "IfcTendonType",
															"id": 2415094496
														}
													],
													"name": "IfcReinforcingElementType",
													"id": 964333572
												},
												{
													"name": "IfcVibrationIsolatorType",
													"id": 3313531582
												}
											],
											"name": "IfcElementComponentType",
											"id": 2590856083
										},
										{
											"children": [
												{
													"name": "IfcFurnitureType",
													"id": 1268542332
												},
												{
													"name": "IfcSystemFurnitureElementType",
													"id": 1580310250
												}
											],
											"name": "IfcFurnishingElementType",
											"id": 4238390223
										},
										{
											"name": "IfcGeographicElementType",
											"id": 4095422895
										},
										{
											"name": "IfcTransportElementType",
											"id": 2097647324
										}
									],
									"name": "IfcElementType",
									"id": 339256511
								},
								{
									"children": [
										{
											"children": [
												{
													"name": "IfcSpaceType",
													"id": 3812236995
												}
											],
											"name": "IfcSpatialStructureElementType",
											"id": 3893378262
										},
										{
											"name": "IfcSpatialZoneType",
											"id": 2481509218
										}
									],
									"name": "IfcSpatialElementType",
									"id": 710998568
								},
								{
									"name": "IfcWindowStyle",
									"id": 1299126871
								}
							],
							"name": "IfcTypeProduct",
							"id": 2347495698
						},
						{
							"children": [
								{
									"children": [
										{
											"name": "IfcConstructionEquipmentResourceType",
											"id": 2185764099
										},
										{
											"name": "IfcConstructionMaterialResourceType",
											"id": 4105962743
										},
										{
											"name": "IfcConstructionProductResourceType",
											"id": 1525564444
										},
										{
											"name": "IfcCrewResourceType",
											"id": 1815067380
										},
										{
											"name": "IfcLaborResourceType",
											"id": 428585644
										},
										{
											"name": "IfcSubContractResourceType",
											"id": 4095615324
										}
									],
									"name": "IfcConstructionResourceType",
									"id": 2574617495
								}
							],
							"name": "IfcTypeResource",
							"id": 3698973494
						}
					],
					"name": "IfcTypeObject",
					"id": 1628702193
				}
			],
			"name": "IfcObjectDefinition",
			"id": 219451334
		},
		{
			"children": [
				{
					"children": [
						{
							"children": [
								{
									"name": "IfcDoorLiningProperties",
									"id": 2963535650
								},
								{
									"name": "IfcDoorPanelProperties",
									"id": 1714330368
								},
								{
									"name": "IfcPermeableCoveringProperties",
									"id": 3566463478
								},
								{
									"name": "IfcReinforcementDefinitionProperties",
									"id": 3765753017
								},
								{
									"name": "IfcWindowLiningProperties",
									"id": 336235671
								},
								{
									"name": "IfcWindowPanelProperties",
									"id": 512836454
								}
							],
							"name": "IfcPreDefinedPropertySet",
							"id": 3967405729
						},
						{
							"name": "IfcPropertySet",
							"id": 1451395588
						},
						{
							"children": [
								{
									"name": "IfcElementQuantity",
									"id": 1883228015
								}
							],
							"name": "IfcQuantitySet",
							"id": 2090586900
						}
					],
					"name": "IfcPropertySetDefinition",
					"id": 3357820518
				},
				{
					"children": [
						{
							"name": "IfcPropertySetTemplate",
							"id": 492091185
						},
						{
							"children": [
								{
									"name": "IfcComplexPropertyTemplate",
									"id": 3875453745
								},
								{
									"name": "IfcSimplePropertyTemplate",
									"id": 3663146110
								}
							],
							"name": "IfcPropertyTemplate",
							"id": 3521284610
						}
					],
					"name": "IfcPropertyTemplateDefinition",
					"id": 1482703590
				}
			],
			"name": "IfcPropertyDefinition",
			"id": 1680319473
		},
		{
			"children": [
				{
					"children": [
						{
							"name": "IfcRelAssignsToActor",
							"id": 1683148259
						},
						{
							"name": "IfcRelAssignsToControl",
							"id": 2495723537
						},
						{
							"children": [
								{
									"name": "IfcRelAssignsToGroupByFactor",
									"id": 1027710054
								}
							],
							"name": "IfcRelAssignsToGroup",
							"id": 1307041759
						},
						{
							"name": "IfcRelAssignsToProcess",
							"id": 4278684876
						},
						{
							"name": "IfcRelAssignsToProduct",
							"id": 2857406711
						},
						{
							"name": "IfcRelAssignsToResource",
							"id": 205026976
						}
					],
					"name": "IfcRelAssigns",
					"id": 3939117080
				},
				{
					"children": [
						{
							"name": "IfcRelAssociatesApproval",
							"id": 4095574036
						},
						{
							"name": "IfcRelAssociatesClassification",
							"id": 919958153
						},
						{
							"name": "IfcRelAssociatesConstraint",
							"id": 2728634034
						},
						{
							"name": "IfcRelAssociatesDocument",
							"id": 982818633
						},
						{
							"name": "IfcRelAssociatesLibrary",
							"id": 3840914261
						},
						{
							"name": "IfcRelAssociatesMaterial",
							"id": 2655215786
						}
					],
					"name": "IfcRelAssociates",
					"id": 1865459582
				},
				{
					"children": [
						{
							"children": [
								{
									"name": "IfcRelConnectsPathElements",
									"id": 3945020480
								},
								{
									"name": "IfcRelConnectsWithRealizingElements",
									"id": 3678494232
								}
							],
							"name": "IfcRelConnectsElements",
							"id": 1204542856
						},
						{
							"name": "IfcRelConnectsPortToElement",
							"id": 4201705270
						},
						{
							"name": "IfcRelConnectsPorts",
							"id": 3190031847
						},
						{
							"name": "IfcRelConnectsStructuralActivity",
							"id": 2127690289
						},
						{
							"children": [
								{
									"name": "IfcRelConnectsWithEccentricity",
									"id": 504942748
								}
							],
							"name": "IfcRelConnectsStructuralMember",
							"id": 1638771189
						},
						{
							"name": "IfcRelContainedInSpatialStructure",
							"id": 3242617779
						},
						{
							"name": "IfcRelCoversBldgElements",
							"id": 886880790
						},
						{
							"name": "IfcRelCoversSpaces",
							"id": 2802773753
						},
						{
							"name": "IfcRelFillsElement",
							"id": 3940055652
						},
						{
							"name": "IfcRelFlowControlElements",
							"id": 279856033
						},
						{
							"name": "IfcRelInterferesElements",
							"id": 427948657
						},
						{
							"name": "IfcRelReferencedInSpatialStructure",
							"id": 1245217292
						},
						{
							"name": "IfcRelSequence",
							"id": 4122056220
						},
						{
							"name": "IfcRelServicesBuildings",
							"id": 366585022
						},
						{
							"children": [
								{
									"children": [
										{
											"name": "IfcRelSpaceBoundary2ndLevel",
											"id": 1521410863
										}
									],
									"name": "IfcRelSpaceBoundary1stLevel",
									"id": 3523091289
								}
							],
							"name": "IfcRelSpaceBoundary",
							"id": 3451746338
						}
					],
					"name": "IfcRelConnects",
					"id": 826625072
				},
				{
					"name": "IfcRelDeclares",
					"id": 2565941209
				},
				{
					"children": [
						{
							"name": "IfcRelAggregates",
							"id": 160246688
						},
						{
							"name": "IfcRelNests",
							"id": 3268803585
						},
						{
							"name": "IfcRelProjectsElement",
							"id": 750771296
						},
						{
							"name": "IfcRelVoidsElement",
							"id": 1401173127
						}
					],
					"name": "IfcRelDecomposes",
					"id": 2551354335
				},
				{
					"children": [
						{
							"name": "IfcRelDefinesByObject",
							"id": 1462361463
						},
						{
							"name": "IfcRelDefinesByProperties",
							"id": 4186316022
						},
						{
							"name": "IfcRelDefinesByTemplate",
							"id": 307848117
						},
						{
							"name": "IfcRelDefinesByType",
							"id": 781010003
						}
					],
					"name": "IfcRelDefines",
					"id": 693640335
				}
			],
			"name": "IfcRelationship",
			"id": 478536968
		}
	],
	"name": "IfcRoot",
	"id": 2341007311
}