import {IfcLineObject,Reference} from './ifc-schema_core'
export class IfcAbsorbedDoseMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcAccelerationMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcAmountOfSubstanceMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcAngularVelocityMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcAreaMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcBoolean {
	type: number=3;
	constructor(public value: boolean) {}
}
export class IfcBoxAlignment {
	type: number=1;
	constructor(public value: string) {}
}
export class IfcComplexNumber {
	constructor(public value: Array<number>) {}
};
export class IfcCompoundPlaneAngleMeasure {
	constructor(public value: Array<number>) {}
};
export class IfcContextDependentMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcCountMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcCurvatureMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcDayInMonthNumber {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcDaylightSavingHour {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcDescriptiveMeasure {
	type: number=1;
	constructor(public value: string) {}
}
export class IfcDimensionCount {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcDoseEquivalentMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcDynamicViscosityMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcElectricCapacitanceMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcElectricChargeMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcElectricConductanceMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcElectricCurrentMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcElectricResistanceMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcElectricVoltageMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcEnergyMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcFontStyle {
	type: number=1;
	constructor(public value: string) {}
}
export class IfcFontVariant {
	type: number=1;
	constructor(public value: string) {}
}
export class IfcFontWeight {
	type: number=1;
	constructor(public value: string) {}
}
export class IfcForceMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcFrequencyMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcGloballyUniqueId {
	type: number=1;
	constructor(public value: string) {}
}
export class IfcHeatFluxDensityMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcHeatingValueMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcHourInDay {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcIdentifier {
	type: number=1;
	constructor(public value: string) {}
}
export class IfcIlluminanceMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcInductanceMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcInteger {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcIntegerCountRateMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcIonConcentrationMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcIsothermalMoistureCapacityMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcKinematicViscosityMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcLabel {
	type: number=1;
	constructor(public value: string) {}
}
export class IfcLengthMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcLinearForceMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcLinearMomentMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcLinearStiffnessMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcLinearVelocityMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcLogical {
	type: number=3;
	constructor(public value: boolean) {}
}
export class IfcLuminousFluxMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcLuminousIntensityDistributionMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcLuminousIntensityMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcMagneticFluxDensityMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcMagneticFluxMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcMassDensityMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcMassFlowRateMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcMassMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcMassPerLengthMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcMinuteInHour {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcModulusOfElasticityMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcModulusOfLinearSubgradeReactionMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcModulusOfRotationalSubgradeReactionMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcModulusOfSubgradeReactionMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcMoistureDiffusivityMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcMolecularWeightMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcMomentOfInertiaMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcMonetaryMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcMonthInYearNumber {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcNormalisedRatioMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcNumericMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcPHMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcParameterValue {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcPlanarForceMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcPlaneAngleMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcPositiveLengthMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcPositivePlaneAngleMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcPositiveRatioMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcPowerMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcPresentableText {
	type: number=1;
	constructor(public value: string) {}
}
export class IfcPressureMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcRadioActivityMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcRatioMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcReal {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcRotationalFrequencyMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcRotationalMassMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcRotationalStiffnessMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcSecondInMinute {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcSectionModulusMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcSectionalAreaIntegralMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcShearModulusMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcSolidAngleMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcSoundPowerMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcSoundPressureMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcSpecificHeatCapacityMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcSpecularExponent {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcSpecularRoughness {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcTemperatureGradientMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcText {
	type: number=1;
	constructor(public value: string) {}
}
export class IfcTextAlignment {
	type: number=1;
	constructor(public value: string) {}
}
export class IfcTextDecoration {
	type: number=1;
	constructor(public value: string) {}
}
export class IfcTextFontName {
	type: number=1;
	constructor(public value: string) {}
}
export class IfcTextTransformation {
	type: number=1;
	constructor(public value: string) {}
}
export class IfcThermalAdmittanceMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcThermalConductivityMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcThermalExpansionCoefficientMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcThermalResistanceMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcThermalTransmittanceMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcThermodynamicTemperatureMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcTimeMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcTimeStamp {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcTorqueMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcVaporPermeabilityMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcVolumeMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcVolumetricFlowRateMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcWarpingConstantMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcWarpingMomentMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcYearNumber {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcActionSourceTypeEnum {
	static DEAD_LOAD_G : any =  { type:3, value:'DEAD_LOAD_G'}; static COMPLETION_G1 : any =  { type:3, value:'COMPLETION_G1'}; static LIVE_LOAD_Q : any =  { type:3, value:'LIVE_LOAD_Q'}; static SNOW_S : any =  { type:3, value:'SNOW_S'}; static WIND_W : any =  { type:3, value:'WIND_W'}; static PRESTRESSING_P : any =  { type:3, value:'PRESTRESSING_P'}; static SETTLEMENT_U : any =  { type:3, value:'SETTLEMENT_U'}; static TEMPERATURE_T : any =  { type:3, value:'TEMPERATURE_T'}; static EARTHQUAKE_E : any =  { type:3, value:'EARTHQUAKE_E'}; static FIRE : any =  { type:3, value:'FIRE'}; static IMPULSE : any =  { type:3, value:'IMPULSE'}; static IMPACT : any =  { type:3, value:'IMPACT'}; static TRANSPORT : any =  { type:3, value:'TRANSPORT'}; static ERECTION : any =  { type:3, value:'ERECTION'}; static PROPPING : any =  { type:3, value:'PROPPING'}; static SYSTEM_IMPERFECTION : any =  { type:3, value:'SYSTEM_IMPERFECTION'}; static SHRINKAGE : any =  { type:3, value:'SHRINKAGE'}; static CREEP : any =  { type:3, value:'CREEP'}; static LACK_OF_FIT : any =  { type:3, value:'LACK_OF_FIT'}; static BUOYANCY : any =  { type:3, value:'BUOYANCY'}; static ICE : any =  { type:3, value:'ICE'}; static CURRENT : any =  { type:3, value:'CURRENT'}; static WAVE : any =  { type:3, value:'WAVE'}; static RAIN : any =  { type:3, value:'RAIN'}; static BRAKES : any =  { type:3, value:'BRAKES'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcActionTypeEnum {
	static PERMANENT_G : any =  { type:3, value:'PERMANENT_G'}; static VARIABLE_Q : any =  { type:3, value:'VARIABLE_Q'}; static EXTRAORDINARY_A : any =  { type:3, value:'EXTRAORDINARY_A'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcActuatorTypeEnum {
	static ELECTRICACTUATOR : any =  { type:3, value:'ELECTRICACTUATOR'}; static HANDOPERATEDACTUATOR : any =  { type:3, value:'HANDOPERATEDACTUATOR'}; static HYDRAULICACTUATOR : any =  { type:3, value:'HYDRAULICACTUATOR'}; static PNEUMATICACTUATOR : any =  { type:3, value:'PNEUMATICACTUATOR'}; static THERMOSTATICACTUATOR : any =  { type:3, value:'THERMOSTATICACTUATOR'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcAddressTypeEnum {
	static OFFICE : any =  { type:3, value:'OFFICE'}; static SITE : any =  { type:3, value:'SITE'}; static HOME : any =  { type:3, value:'HOME'}; static DISTRIBUTIONPOINT : any =  { type:3, value:'DISTRIBUTIONPOINT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; 
}
export class IfcAheadOrBehind {
	static AHEAD : any =  { type:3, value:'AHEAD'}; static BEHIND : any =  { type:3, value:'BEHIND'}; 
}
export class IfcAirTerminalBoxTypeEnum {
	static CONSTANTFLOW : any =  { type:3, value:'CONSTANTFLOW'}; static VARIABLEFLOWPRESSUREDEPENDANT : any =  { type:3, value:'VARIABLEFLOWPRESSUREDEPENDANT'}; static VARIABLEFLOWPRESSUREINDEPENDANT : any =  { type:3, value:'VARIABLEFLOWPRESSUREINDEPENDANT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcAirTerminalTypeEnum {
	static GRILLE : any =  { type:3, value:'GRILLE'}; static REGISTER : any =  { type:3, value:'REGISTER'}; static DIFFUSER : any =  { type:3, value:'DIFFUSER'}; static EYEBALL : any =  { type:3, value:'EYEBALL'}; static IRIS : any =  { type:3, value:'IRIS'}; static LINEARGRILLE : any =  { type:3, value:'LINEARGRILLE'}; static LINEARDIFFUSER : any =  { type:3, value:'LINEARDIFFUSER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcAirToAirHeatRecoveryTypeEnum {
	static FIXEDPLATECOUNTERFLOWEXCHANGER : any =  { type:3, value:'FIXEDPLATECOUNTERFLOWEXCHANGER'}; static FIXEDPLATECROSSFLOWEXCHANGER : any =  { type:3, value:'FIXEDPLATECROSSFLOWEXCHANGER'}; static FIXEDPLATEPARALLELFLOWEXCHANGER : any =  { type:3, value:'FIXEDPLATEPARALLELFLOWEXCHANGER'}; static ROTARYWHEEL : any =  { type:3, value:'ROTARYWHEEL'}; static RUNAROUNDCOILLOOP : any =  { type:3, value:'RUNAROUNDCOILLOOP'}; static HEATPIPE : any =  { type:3, value:'HEATPIPE'}; static TWINTOWERENTHALPYRECOVERYLOOPS : any =  { type:3, value:'TWINTOWERENTHALPYRECOVERYLOOPS'}; static THERMOSIPHONSEALEDTUBEHEATEXCHANGERS : any =  { type:3, value:'THERMOSIPHONSEALEDTUBEHEATEXCHANGERS'}; static THERMOSIPHONCOILTYPEHEATEXCHANGERS : any =  { type:3, value:'THERMOSIPHONCOILTYPEHEATEXCHANGERS'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcAlarmTypeEnum {
	static BELL : any =  { type:3, value:'BELL'}; static BREAKGLASSBUTTON : any =  { type:3, value:'BREAKGLASSBUTTON'}; static LIGHT : any =  { type:3, value:'LIGHT'}; static MANUALPULLBOX : any =  { type:3, value:'MANUALPULLBOX'}; static SIREN : any =  { type:3, value:'SIREN'}; static WHISTLE : any =  { type:3, value:'WHISTLE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcAnalysisModelTypeEnum {
	static IN_PLANE_LOADING_2D : any =  { type:3, value:'IN_PLANE_LOADING_2D'}; static OUT_PLANE_LOADING_2D : any =  { type:3, value:'OUT_PLANE_LOADING_2D'}; static LOADING_3D : any =  { type:3, value:'LOADING_3D'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcAnalysisTheoryTypeEnum {
	static FIRST_ORDER_THEORY : any =  { type:3, value:'FIRST_ORDER_THEORY'}; static SECOND_ORDER_THEORY : any =  { type:3, value:'SECOND_ORDER_THEORY'}; static THIRD_ORDER_THEORY : any =  { type:3, value:'THIRD_ORDER_THEORY'}; static FULL_NONLINEAR_THEORY : any =  { type:3, value:'FULL_NONLINEAR_THEORY'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcArithmeticOperatorEnum {
	static ADD : any =  { type:3, value:'ADD'}; static DIVIDE : any =  { type:3, value:'DIVIDE'}; static MULTIPLY : any =  { type:3, value:'MULTIPLY'}; static SUBTRACT : any =  { type:3, value:'SUBTRACT'}; 
}
export class IfcAssemblyPlaceEnum {
	static SITE : any =  { type:3, value:'SITE'}; static FACTORY : any =  { type:3, value:'FACTORY'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcBSplineCurveForm {
	static POLYLINE_FORM : any =  { type:3, value:'POLYLINE_FORM'}; static CIRCULAR_ARC : any =  { type:3, value:'CIRCULAR_ARC'}; static ELLIPTIC_ARC : any =  { type:3, value:'ELLIPTIC_ARC'}; static PARABOLIC_ARC : any =  { type:3, value:'PARABOLIC_ARC'}; static HYPERBOLIC_ARC : any =  { type:3, value:'HYPERBOLIC_ARC'}; static UNSPECIFIED : any =  { type:3, value:'UNSPECIFIED'}; 
}
export class IfcBeamTypeEnum {
	static BEAM : any =  { type:3, value:'BEAM'}; static JOIST : any =  { type:3, value:'JOIST'}; static LINTEL : any =  { type:3, value:'LINTEL'}; static T_BEAM : any =  { type:3, value:'T_BEAM'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcBenchmarkEnum {
	static GREATERTHAN : any =  { type:3, value:'GREATERTHAN'}; static GREATERTHANOREQUALTO : any =  { type:3, value:'GREATERTHANOREQUALTO'}; static LESSTHAN : any =  { type:3, value:'LESSTHAN'}; static LESSTHANOREQUALTO : any =  { type:3, value:'LESSTHANOREQUALTO'}; static EQUALTO : any =  { type:3, value:'EQUALTO'}; static NOTEQUALTO : any =  { type:3, value:'NOTEQUALTO'}; 
}
export class IfcBoilerTypeEnum {
	static WATER : any =  { type:3, value:'WATER'}; static STEAM : any =  { type:3, value:'STEAM'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcBooleanOperator {
	static UNION : any =  { type:3, value:'UNION'}; static INTERSECTION : any =  { type:3, value:'INTERSECTION'}; static DIFFERENCE : any =  { type:3, value:'DIFFERENCE'}; 
}
export class IfcBuildingElementProxyTypeEnum {
	static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCableCarrierFittingTypeEnum {
	static BEND : any =  { type:3, value:'BEND'}; static CROSS : any =  { type:3, value:'CROSS'}; static REDUCER : any =  { type:3, value:'REDUCER'}; static TEE : any =  { type:3, value:'TEE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCableCarrierSegmentTypeEnum {
	static CABLELADDERSEGMENT : any =  { type:3, value:'CABLELADDERSEGMENT'}; static CABLETRAYSEGMENT : any =  { type:3, value:'CABLETRAYSEGMENT'}; static CABLETRUNKINGSEGMENT : any =  { type:3, value:'CABLETRUNKINGSEGMENT'}; static CONDUITSEGMENT : any =  { type:3, value:'CONDUITSEGMENT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCableSegmentTypeEnum {
	static CABLESEGMENT : any =  { type:3, value:'CABLESEGMENT'}; static CONDUCTORSEGMENT : any =  { type:3, value:'CONDUCTORSEGMENT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcChangeActionEnum {
	static NOCHANGE : any =  { type:3, value:'NOCHANGE'}; static MODIFIED : any =  { type:3, value:'MODIFIED'}; static ADDED : any =  { type:3, value:'ADDED'}; static DELETED : any =  { type:3, value:'DELETED'}; static MODIFIEDADDED : any =  { type:3, value:'MODIFIEDADDED'}; static MODIFIEDDELETED : any =  { type:3, value:'MODIFIEDDELETED'}; 
}
export class IfcChillerTypeEnum {
	static AIRCOOLED : any =  { type:3, value:'AIRCOOLED'}; static WATERCOOLED : any =  { type:3, value:'WATERCOOLED'}; static HEATRECOVERY : any =  { type:3, value:'HEATRECOVERY'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCoilTypeEnum {
	static DXCOOLINGCOIL : any =  { type:3, value:'DXCOOLINGCOIL'}; static WATERCOOLINGCOIL : any =  { type:3, value:'WATERCOOLINGCOIL'}; static STEAMHEATINGCOIL : any =  { type:3, value:'STEAMHEATINGCOIL'}; static WATERHEATINGCOIL : any =  { type:3, value:'WATERHEATINGCOIL'}; static ELECTRICHEATINGCOIL : any =  { type:3, value:'ELECTRICHEATINGCOIL'}; static GASHEATINGCOIL : any =  { type:3, value:'GASHEATINGCOIL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcColumnTypeEnum {
	static COLUMN : any =  { type:3, value:'COLUMN'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCompressorTypeEnum {
	static DYNAMIC : any =  { type:3, value:'DYNAMIC'}; static RECIPROCATING : any =  { type:3, value:'RECIPROCATING'}; static ROTARY : any =  { type:3, value:'ROTARY'}; static SCROLL : any =  { type:3, value:'SCROLL'}; static TROCHOIDAL : any =  { type:3, value:'TROCHOIDAL'}; static SINGLESTAGE : any =  { type:3, value:'SINGLESTAGE'}; static BOOSTER : any =  { type:3, value:'BOOSTER'}; static OPENTYPE : any =  { type:3, value:'OPENTYPE'}; static HERMETIC : any =  { type:3, value:'HERMETIC'}; static SEMIHERMETIC : any =  { type:3, value:'SEMIHERMETIC'}; static WELDEDSHELLHERMETIC : any =  { type:3, value:'WELDEDSHELLHERMETIC'}; static ROLLINGPISTON : any =  { type:3, value:'ROLLINGPISTON'}; static ROTARYVANE : any =  { type:3, value:'ROTARYVANE'}; static SINGLESCREW : any =  { type:3, value:'SINGLESCREW'}; static TWINSCREW : any =  { type:3, value:'TWINSCREW'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCondenserTypeEnum {
	static WATERCOOLEDSHELLTUBE : any =  { type:3, value:'WATERCOOLEDSHELLTUBE'}; static WATERCOOLEDSHELLCOIL : any =  { type:3, value:'WATERCOOLEDSHELLCOIL'}; static WATERCOOLEDTUBEINTUBE : any =  { type:3, value:'WATERCOOLEDTUBEINTUBE'}; static WATERCOOLEDBRAZEDPLATE : any =  { type:3, value:'WATERCOOLEDBRAZEDPLATE'}; static AIRCOOLED : any =  { type:3, value:'AIRCOOLED'}; static EVAPORATIVECOOLED : any =  { type:3, value:'EVAPORATIVECOOLED'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcConnectionTypeEnum {
	static ATPATH : any =  { type:3, value:'ATPATH'}; static ATSTART : any =  { type:3, value:'ATSTART'}; static ATEND : any =  { type:3, value:'ATEND'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcConstraintEnum {
	static HARD : any =  { type:3, value:'HARD'}; static SOFT : any =  { type:3, value:'SOFT'}; static ADVISORY : any =  { type:3, value:'ADVISORY'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcControllerTypeEnum {
	static FLOATING : any =  { type:3, value:'FLOATING'}; static PROPORTIONAL : any =  { type:3, value:'PROPORTIONAL'}; static PROPORTIONALINTEGRAL : any =  { type:3, value:'PROPORTIONALINTEGRAL'}; static PROPORTIONALINTEGRALDERIVATIVE : any =  { type:3, value:'PROPORTIONALINTEGRALDERIVATIVE'}; static TIMEDTWOPOSITION : any =  { type:3, value:'TIMEDTWOPOSITION'}; static TWOPOSITION : any =  { type:3, value:'TWOPOSITION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCooledBeamTypeEnum {
	static ACTIVE : any =  { type:3, value:'ACTIVE'}; static PASSIVE : any =  { type:3, value:'PASSIVE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCoolingTowerTypeEnum {
	static NATURALDRAFT : any =  { type:3, value:'NATURALDRAFT'}; static MECHANICALINDUCEDDRAFT : any =  { type:3, value:'MECHANICALINDUCEDDRAFT'}; static MECHANICALFORCEDDRAFT : any =  { type:3, value:'MECHANICALFORCEDDRAFT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCostScheduleTypeEnum {
	static BUDGET : any =  { type:3, value:'BUDGET'}; static COSTPLAN : any =  { type:3, value:'COSTPLAN'}; static ESTIMATE : any =  { type:3, value:'ESTIMATE'}; static TENDER : any =  { type:3, value:'TENDER'}; static PRICEDBILLOFQUANTITIES : any =  { type:3, value:'PRICEDBILLOFQUANTITIES'}; static UNPRICEDBILLOFQUANTITIES : any =  { type:3, value:'UNPRICEDBILLOFQUANTITIES'}; static SCHEDULEOFRATES : any =  { type:3, value:'SCHEDULEOFRATES'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCoveringTypeEnum {
	static CEILING : any =  { type:3, value:'CEILING'}; static FLOORING : any =  { type:3, value:'FLOORING'}; static CLADDING : any =  { type:3, value:'CLADDING'}; static ROOFING : any =  { type:3, value:'ROOFING'}; static INSULATION : any =  { type:3, value:'INSULATION'}; static MEMBRANE : any =  { type:3, value:'MEMBRANE'}; static SLEEVING : any =  { type:3, value:'SLEEVING'}; static WRAPPING : any =  { type:3, value:'WRAPPING'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCurrencyEnum {
	static AED : any =  { type:3, value:'AED'}; static AES : any =  { type:3, value:'AES'}; static ATS : any =  { type:3, value:'ATS'}; static AUD : any =  { type:3, value:'AUD'}; static BBD : any =  { type:3, value:'BBD'}; static BEG : any =  { type:3, value:'BEG'}; static BGL : any =  { type:3, value:'BGL'}; static BHD : any =  { type:3, value:'BHD'}; static BMD : any =  { type:3, value:'BMD'}; static BND : any =  { type:3, value:'BND'}; static BRL : any =  { type:3, value:'BRL'}; static BSD : any =  { type:3, value:'BSD'}; static BWP : any =  { type:3, value:'BWP'}; static BZD : any =  { type:3, value:'BZD'}; static CAD : any =  { type:3, value:'CAD'}; static CBD : any =  { type:3, value:'CBD'}; static CHF : any =  { type:3, value:'CHF'}; static CLP : any =  { type:3, value:'CLP'}; static CNY : any =  { type:3, value:'CNY'}; static CYS : any =  { type:3, value:'CYS'}; static CZK : any =  { type:3, value:'CZK'}; static DDP : any =  { type:3, value:'DDP'}; static DEM : any =  { type:3, value:'DEM'}; static DKK : any =  { type:3, value:'DKK'}; static EGL : any =  { type:3, value:'EGL'}; static EST : any =  { type:3, value:'EST'}; static EUR : any =  { type:3, value:'EUR'}; static FAK : any =  { type:3, value:'FAK'}; static FIM : any =  { type:3, value:'FIM'}; static FJD : any =  { type:3, value:'FJD'}; static FKP : any =  { type:3, value:'FKP'}; static FRF : any =  { type:3, value:'FRF'}; static GBP : any =  { type:3, value:'GBP'}; static GIP : any =  { type:3, value:'GIP'}; static GMD : any =  { type:3, value:'GMD'}; static GRX : any =  { type:3, value:'GRX'}; static HKD : any =  { type:3, value:'HKD'}; static HUF : any =  { type:3, value:'HUF'}; static ICK : any =  { type:3, value:'ICK'}; static IDR : any =  { type:3, value:'IDR'}; static ILS : any =  { type:3, value:'ILS'}; static INR : any =  { type:3, value:'INR'}; static IRP : any =  { type:3, value:'IRP'}; static ITL : any =  { type:3, value:'ITL'}; static JMD : any =  { type:3, value:'JMD'}; static JOD : any =  { type:3, value:'JOD'}; static JPY : any =  { type:3, value:'JPY'}; static KES : any =  { type:3, value:'KES'}; static KRW : any =  { type:3, value:'KRW'}; static KWD : any =  { type:3, value:'KWD'}; static KYD : any =  { type:3, value:'KYD'}; static LKR : any =  { type:3, value:'LKR'}; static LUF : any =  { type:3, value:'LUF'}; static MTL : any =  { type:3, value:'MTL'}; static MUR : any =  { type:3, value:'MUR'}; static MXN : any =  { type:3, value:'MXN'}; static MYR : any =  { type:3, value:'MYR'}; static NLG : any =  { type:3, value:'NLG'}; static NZD : any =  { type:3, value:'NZD'}; static OMR : any =  { type:3, value:'OMR'}; static PGK : any =  { type:3, value:'PGK'}; static PHP : any =  { type:3, value:'PHP'}; static PKR : any =  { type:3, value:'PKR'}; static PLN : any =  { type:3, value:'PLN'}; static PTN : any =  { type:3, value:'PTN'}; static QAR : any =  { type:3, value:'QAR'}; static RUR : any =  { type:3, value:'RUR'}; static SAR : any =  { type:3, value:'SAR'}; static SCR : any =  { type:3, value:'SCR'}; static SEK : any =  { type:3, value:'SEK'}; static SGD : any =  { type:3, value:'SGD'}; static SKP : any =  { type:3, value:'SKP'}; static THB : any =  { type:3, value:'THB'}; static TRL : any =  { type:3, value:'TRL'}; static TTD : any =  { type:3, value:'TTD'}; static TWD : any =  { type:3, value:'TWD'}; static USD : any =  { type:3, value:'USD'}; static VEB : any =  { type:3, value:'VEB'}; static VND : any =  { type:3, value:'VND'}; static XEU : any =  { type:3, value:'XEU'}; static ZAR : any =  { type:3, value:'ZAR'}; static ZWD : any =  { type:3, value:'ZWD'}; static NOK : any =  { type:3, value:'NOK'}; 
}
export class IfcCurtainWallTypeEnum {
	static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDamperTypeEnum {
	static CONTROLDAMPER : any =  { type:3, value:'CONTROLDAMPER'}; static FIREDAMPER : any =  { type:3, value:'FIREDAMPER'}; static SMOKEDAMPER : any =  { type:3, value:'SMOKEDAMPER'}; static FIRESMOKEDAMPER : any =  { type:3, value:'FIRESMOKEDAMPER'}; static BACKDRAFTDAMPER : any =  { type:3, value:'BACKDRAFTDAMPER'}; static RELIEFDAMPER : any =  { type:3, value:'RELIEFDAMPER'}; static BLASTDAMPER : any =  { type:3, value:'BLASTDAMPER'}; static GRAVITYDAMPER : any =  { type:3, value:'GRAVITYDAMPER'}; static GRAVITYRELIEFDAMPER : any =  { type:3, value:'GRAVITYRELIEFDAMPER'}; static BALANCINGDAMPER : any =  { type:3, value:'BALANCINGDAMPER'}; static FUMEHOODEXHAUST : any =  { type:3, value:'FUMEHOODEXHAUST'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDataOriginEnum {
	static MEASURED : any =  { type:3, value:'MEASURED'}; static PREDICTED : any =  { type:3, value:'PREDICTED'}; static SIMULATED : any =  { type:3, value:'SIMULATED'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDerivedUnitEnum {
	static ANGULARVELOCITYUNIT : any =  { type:3, value:'ANGULARVELOCITYUNIT'}; static COMPOUNDPLANEANGLEUNIT : any =  { type:3, value:'COMPOUNDPLANEANGLEUNIT'}; static DYNAMICVISCOSITYUNIT : any =  { type:3, value:'DYNAMICVISCOSITYUNIT'}; static HEATFLUXDENSITYUNIT : any =  { type:3, value:'HEATFLUXDENSITYUNIT'}; static INTEGERCOUNTRATEUNIT : any =  { type:3, value:'INTEGERCOUNTRATEUNIT'}; static ISOTHERMALMOISTURECAPACITYUNIT : any =  { type:3, value:'ISOTHERMALMOISTURECAPACITYUNIT'}; static KINEMATICVISCOSITYUNIT : any =  { type:3, value:'KINEMATICVISCOSITYUNIT'}; static LINEARVELOCITYUNIT : any =  { type:3, value:'LINEARVELOCITYUNIT'}; static MASSDENSITYUNIT : any =  { type:3, value:'MASSDENSITYUNIT'}; static MASSFLOWRATEUNIT : any =  { type:3, value:'MASSFLOWRATEUNIT'}; static MOISTUREDIFFUSIVITYUNIT : any =  { type:3, value:'MOISTUREDIFFUSIVITYUNIT'}; static MOLECULARWEIGHTUNIT : any =  { type:3, value:'MOLECULARWEIGHTUNIT'}; static SPECIFICHEATCAPACITYUNIT : any =  { type:3, value:'SPECIFICHEATCAPACITYUNIT'}; static THERMALADMITTANCEUNIT : any =  { type:3, value:'THERMALADMITTANCEUNIT'}; static THERMALCONDUCTANCEUNIT : any =  { type:3, value:'THERMALCONDUCTANCEUNIT'}; static THERMALRESISTANCEUNIT : any =  { type:3, value:'THERMALRESISTANCEUNIT'}; static THERMALTRANSMITTANCEUNIT : any =  { type:3, value:'THERMALTRANSMITTANCEUNIT'}; static VAPORPERMEABILITYUNIT : any =  { type:3, value:'VAPORPERMEABILITYUNIT'}; static VOLUMETRICFLOWRATEUNIT : any =  { type:3, value:'VOLUMETRICFLOWRATEUNIT'}; static ROTATIONALFREQUENCYUNIT : any =  { type:3, value:'ROTATIONALFREQUENCYUNIT'}; static TORQUEUNIT : any =  { type:3, value:'TORQUEUNIT'}; static MOMENTOFINERTIAUNIT : any =  { type:3, value:'MOMENTOFINERTIAUNIT'}; static LINEARMOMENTUNIT : any =  { type:3, value:'LINEARMOMENTUNIT'}; static LINEARFORCEUNIT : any =  { type:3, value:'LINEARFORCEUNIT'}; static PLANARFORCEUNIT : any =  { type:3, value:'PLANARFORCEUNIT'}; static MODULUSOFELASTICITYUNIT : any =  { type:3, value:'MODULUSOFELASTICITYUNIT'}; static SHEARMODULUSUNIT : any =  { type:3, value:'SHEARMODULUSUNIT'}; static LINEARSTIFFNESSUNIT : any =  { type:3, value:'LINEARSTIFFNESSUNIT'}; static ROTATIONALSTIFFNESSUNIT : any =  { type:3, value:'ROTATIONALSTIFFNESSUNIT'}; static MODULUSOFSUBGRADEREACTIONUNIT : any =  { type:3, value:'MODULUSOFSUBGRADEREACTIONUNIT'}; static ACCELERATIONUNIT : any =  { type:3, value:'ACCELERATIONUNIT'}; static CURVATUREUNIT : any =  { type:3, value:'CURVATUREUNIT'}; static HEATINGVALUEUNIT : any =  { type:3, value:'HEATINGVALUEUNIT'}; static IONCONCENTRATIONUNIT : any =  { type:3, value:'IONCONCENTRATIONUNIT'}; static LUMINOUSINTENSITYDISTRIBUTIONUNIT : any =  { type:3, value:'LUMINOUSINTENSITYDISTRIBUTIONUNIT'}; static MASSPERLENGTHUNIT : any =  { type:3, value:'MASSPERLENGTHUNIT'}; static MODULUSOFLINEARSUBGRADEREACTIONUNIT : any =  { type:3, value:'MODULUSOFLINEARSUBGRADEREACTIONUNIT'}; static MODULUSOFROTATIONALSUBGRADEREACTIONUNIT : any =  { type:3, value:'MODULUSOFROTATIONALSUBGRADEREACTIONUNIT'}; static PHUNIT : any =  { type:3, value:'PHUNIT'}; static ROTATIONALMASSUNIT : any =  { type:3, value:'ROTATIONALMASSUNIT'}; static SECTIONAREAINTEGRALUNIT : any =  { type:3, value:'SECTIONAREAINTEGRALUNIT'}; static SECTIONMODULUSUNIT : any =  { type:3, value:'SECTIONMODULUSUNIT'}; static SOUNDPOWERUNIT : any =  { type:3, value:'SOUNDPOWERUNIT'}; static SOUNDPRESSUREUNIT : any =  { type:3, value:'SOUNDPRESSUREUNIT'}; static TEMPERATUREGRADIENTUNIT : any =  { type:3, value:'TEMPERATUREGRADIENTUNIT'}; static THERMALEXPANSIONCOEFFICIENTUNIT : any =  { type:3, value:'THERMALEXPANSIONCOEFFICIENTUNIT'}; static WARPINGCONSTANTUNIT : any =  { type:3, value:'WARPINGCONSTANTUNIT'}; static WARPINGMOMENTUNIT : any =  { type:3, value:'WARPINGMOMENTUNIT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; 
}
export class IfcDimensionExtentUsage {
	static ORIGIN : any =  { type:3, value:'ORIGIN'}; static TARGET : any =  { type:3, value:'TARGET'}; 
}
export class IfcDirectionSenseEnum {
	static POSITIVE : any =  { type:3, value:'POSITIVE'}; static NEGATIVE : any =  { type:3, value:'NEGATIVE'}; 
}
export class IfcDistributionChamberElementTypeEnum {
	static FORMEDDUCT : any =  { type:3, value:'FORMEDDUCT'}; static INSPECTIONCHAMBER : any =  { type:3, value:'INSPECTIONCHAMBER'}; static INSPECTIONPIT : any =  { type:3, value:'INSPECTIONPIT'}; static MANHOLE : any =  { type:3, value:'MANHOLE'}; static METERCHAMBER : any =  { type:3, value:'METERCHAMBER'}; static SUMP : any =  { type:3, value:'SUMP'}; static TRENCH : any =  { type:3, value:'TRENCH'}; static VALVECHAMBER : any =  { type:3, value:'VALVECHAMBER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDocumentConfidentialityEnum {
	static PUBLIC : any =  { type:3, value:'PUBLIC'}; static RESTRICTED : any =  { type:3, value:'RESTRICTED'}; static CONFIDENTIAL : any =  { type:3, value:'CONFIDENTIAL'}; static PERSONAL : any =  { type:3, value:'PERSONAL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDocumentStatusEnum {
	static DRAFT : any =  { type:3, value:'DRAFT'}; static FINALDRAFT : any =  { type:3, value:'FINALDRAFT'}; static FINAL : any =  { type:3, value:'FINAL'}; static REVISION : any =  { type:3, value:'REVISION'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDoorPanelOperationEnum {
	static SWINGING : any =  { type:3, value:'SWINGING'}; static DOUBLE_ACTING : any =  { type:3, value:'DOUBLE_ACTING'}; static SLIDING : any =  { type:3, value:'SLIDING'}; static FOLDING : any =  { type:3, value:'FOLDING'}; static REVOLVING : any =  { type:3, value:'REVOLVING'}; static ROLLINGUP : any =  { type:3, value:'ROLLINGUP'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDoorPanelPositionEnum {
	static LEFT : any =  { type:3, value:'LEFT'}; static MIDDLE : any =  { type:3, value:'MIDDLE'}; static RIGHT : any =  { type:3, value:'RIGHT'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDoorStyleConstructionEnum {
	static ALUMINIUM : any =  { type:3, value:'ALUMINIUM'}; static HIGH_GRADE_STEEL : any =  { type:3, value:'HIGH_GRADE_STEEL'}; static STEEL : any =  { type:3, value:'STEEL'}; static WOOD : any =  { type:3, value:'WOOD'}; static ALUMINIUM_WOOD : any =  { type:3, value:'ALUMINIUM_WOOD'}; static ALUMINIUM_PLASTIC : any =  { type:3, value:'ALUMINIUM_PLASTIC'}; static PLASTIC : any =  { type:3, value:'PLASTIC'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDoorStyleOperationEnum {
	static SINGLE_SWING_LEFT : any =  { type:3, value:'SINGLE_SWING_LEFT'}; static SINGLE_SWING_RIGHT : any =  { type:3, value:'SINGLE_SWING_RIGHT'}; static DOUBLE_DOOR_SINGLE_SWING : any =  { type:3, value:'DOUBLE_DOOR_SINGLE_SWING'}; static DOUBLE_DOOR_SINGLE_SWING_OPPOSITE_LEFT : any =  { type:3, value:'DOUBLE_DOOR_SINGLE_SWING_OPPOSITE_LEFT'}; static DOUBLE_DOOR_SINGLE_SWING_OPPOSITE_RIGHT : any =  { type:3, value:'DOUBLE_DOOR_SINGLE_SWING_OPPOSITE_RIGHT'}; static DOUBLE_SWING_LEFT : any =  { type:3, value:'DOUBLE_SWING_LEFT'}; static DOUBLE_SWING_RIGHT : any =  { type:3, value:'DOUBLE_SWING_RIGHT'}; static DOUBLE_DOOR_DOUBLE_SWING : any =  { type:3, value:'DOUBLE_DOOR_DOUBLE_SWING'}; static SLIDING_TO_LEFT : any =  { type:3, value:'SLIDING_TO_LEFT'}; static SLIDING_TO_RIGHT : any =  { type:3, value:'SLIDING_TO_RIGHT'}; static DOUBLE_DOOR_SLIDING : any =  { type:3, value:'DOUBLE_DOOR_SLIDING'}; static FOLDING_TO_LEFT : any =  { type:3, value:'FOLDING_TO_LEFT'}; static FOLDING_TO_RIGHT : any =  { type:3, value:'FOLDING_TO_RIGHT'}; static DOUBLE_DOOR_FOLDING : any =  { type:3, value:'DOUBLE_DOOR_FOLDING'}; static REVOLVING : any =  { type:3, value:'REVOLVING'}; static ROLLINGUP : any =  { type:3, value:'ROLLINGUP'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDuctFittingTypeEnum {
	static BEND : any =  { type:3, value:'BEND'}; static CONNECTOR : any =  { type:3, value:'CONNECTOR'}; static ENTRY : any =  { type:3, value:'ENTRY'}; static EXIT : any =  { type:3, value:'EXIT'}; static JUNCTION : any =  { type:3, value:'JUNCTION'}; static OBSTRUCTION : any =  { type:3, value:'OBSTRUCTION'}; static TRANSITION : any =  { type:3, value:'TRANSITION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDuctSegmentTypeEnum {
	static RIGIDSEGMENT : any =  { type:3, value:'RIGIDSEGMENT'}; static FLEXIBLESEGMENT : any =  { type:3, value:'FLEXIBLESEGMENT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDuctSilencerTypeEnum {
	static FLATOVAL : any =  { type:3, value:'FLATOVAL'}; static RECTANGULAR : any =  { type:3, value:'RECTANGULAR'}; static ROUND : any =  { type:3, value:'ROUND'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcElectricApplianceTypeEnum {
	static COMPUTER : any =  { type:3, value:'COMPUTER'}; static DIRECTWATERHEATER : any =  { type:3, value:'DIRECTWATERHEATER'}; static DISHWASHER : any =  { type:3, value:'DISHWASHER'}; static ELECTRICCOOKER : any =  { type:3, value:'ELECTRICCOOKER'}; static ELECTRICHEATER : any =  { type:3, value:'ELECTRICHEATER'}; static FACSIMILE : any =  { type:3, value:'FACSIMILE'}; static FREESTANDINGFAN : any =  { type:3, value:'FREESTANDINGFAN'}; static FREEZER : any =  { type:3, value:'FREEZER'}; static FRIDGE_FREEZER : any =  { type:3, value:'FRIDGE_FREEZER'}; static HANDDRYER : any =  { type:3, value:'HANDDRYER'}; static INDIRECTWATERHEATER : any =  { type:3, value:'INDIRECTWATERHEATER'}; static MICROWAVE : any =  { type:3, value:'MICROWAVE'}; static PHOTOCOPIER : any =  { type:3, value:'PHOTOCOPIER'}; static PRINTER : any =  { type:3, value:'PRINTER'}; static REFRIGERATOR : any =  { type:3, value:'REFRIGERATOR'}; static RADIANTHEATER : any =  { type:3, value:'RADIANTHEATER'}; static SCANNER : any =  { type:3, value:'SCANNER'}; static TELEPHONE : any =  { type:3, value:'TELEPHONE'}; static TUMBLEDRYER : any =  { type:3, value:'TUMBLEDRYER'}; static TV : any =  { type:3, value:'TV'}; static VENDINGMACHINE : any =  { type:3, value:'VENDINGMACHINE'}; static WASHINGMACHINE : any =  { type:3, value:'WASHINGMACHINE'}; static WATERHEATER : any =  { type:3, value:'WATERHEATER'}; static WATERCOOLER : any =  { type:3, value:'WATERCOOLER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcElectricCurrentEnum {
	static ALTERNATING : any =  { type:3, value:'ALTERNATING'}; static DIRECT : any =  { type:3, value:'DIRECT'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcElectricDistributionPointFunctionEnum {
	static ALARMPANEL : any =  { type:3, value:'ALARMPANEL'}; static CONSUMERUNIT : any =  { type:3, value:'CONSUMERUNIT'}; static CONTROLPANEL : any =  { type:3, value:'CONTROLPANEL'}; static DISTRIBUTIONBOARD : any =  { type:3, value:'DISTRIBUTIONBOARD'}; static GASDETECTORPANEL : any =  { type:3, value:'GASDETECTORPANEL'}; static INDICATORPANEL : any =  { type:3, value:'INDICATORPANEL'}; static MIMICPANEL : any =  { type:3, value:'MIMICPANEL'}; static MOTORCONTROLCENTRE : any =  { type:3, value:'MOTORCONTROLCENTRE'}; static SWITCHBOARD : any =  { type:3, value:'SWITCHBOARD'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcElectricFlowStorageDeviceTypeEnum {
	static BATTERY : any =  { type:3, value:'BATTERY'}; static CAPACITORBANK : any =  { type:3, value:'CAPACITORBANK'}; static HARMONICFILTER : any =  { type:3, value:'HARMONICFILTER'}; static INDUCTORBANK : any =  { type:3, value:'INDUCTORBANK'}; static UPS : any =  { type:3, value:'UPS'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcElectricGeneratorTypeEnum {
	static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcElectricHeaterTypeEnum {
	static ELECTRICPOINTHEATER : any =  { type:3, value:'ELECTRICPOINTHEATER'}; static ELECTRICCABLEHEATER : any =  { type:3, value:'ELECTRICCABLEHEATER'}; static ELECTRICMATHEATER : any =  { type:3, value:'ELECTRICMATHEATER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcElectricMotorTypeEnum {
	static DC : any =  { type:3, value:'DC'}; static INDUCTION : any =  { type:3, value:'INDUCTION'}; static POLYPHASE : any =  { type:3, value:'POLYPHASE'}; static RELUCTANCESYNCHRONOUS : any =  { type:3, value:'RELUCTANCESYNCHRONOUS'}; static SYNCHRONOUS : any =  { type:3, value:'SYNCHRONOUS'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcElectricTimeControlTypeEnum {
	static TIMECLOCK : any =  { type:3, value:'TIMECLOCK'}; static TIMEDELAY : any =  { type:3, value:'TIMEDELAY'}; static RELAY : any =  { type:3, value:'RELAY'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcElementAssemblyTypeEnum {
	static ACCESSORY_ASSEMBLY : any =  { type:3, value:'ACCESSORY_ASSEMBLY'}; static ARCH : any =  { type:3, value:'ARCH'}; static BEAM_GRID : any =  { type:3, value:'BEAM_GRID'}; static BRACED_FRAME : any =  { type:3, value:'BRACED_FRAME'}; static GIRDER : any =  { type:3, value:'GIRDER'}; static REINFORCEMENT_UNIT : any =  { type:3, value:'REINFORCEMENT_UNIT'}; static RIGID_FRAME : any =  { type:3, value:'RIGID_FRAME'}; static SLAB_FIELD : any =  { type:3, value:'SLAB_FIELD'}; static TRUSS : any =  { type:3, value:'TRUSS'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcElementCompositionEnum {
	static COMPLEX : any =  { type:3, value:'COMPLEX'}; static ELEMENT : any =  { type:3, value:'ELEMENT'}; static PARTIAL : any =  { type:3, value:'PARTIAL'}; 
}
export class IfcEnergySequenceEnum {
	static PRIMARY : any =  { type:3, value:'PRIMARY'}; static SECONDARY : any =  { type:3, value:'SECONDARY'}; static TERTIARY : any =  { type:3, value:'TERTIARY'}; static AUXILIARY : any =  { type:3, value:'AUXILIARY'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcEnvironmentalImpactCategoryEnum {
	static COMBINEDVALUE : any =  { type:3, value:'COMBINEDVALUE'}; static DISPOSAL : any =  { type:3, value:'DISPOSAL'}; static EXTRACTION : any =  { type:3, value:'EXTRACTION'}; static INSTALLATION : any =  { type:3, value:'INSTALLATION'}; static MANUFACTURE : any =  { type:3, value:'MANUFACTURE'}; static TRANSPORTATION : any =  { type:3, value:'TRANSPORTATION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcEvaporativeCoolerTypeEnum {
	static DIRECTEVAPORATIVERANDOMMEDIAAIRCOOLER : any =  { type:3, value:'DIRECTEVAPORATIVERANDOMMEDIAAIRCOOLER'}; static DIRECTEVAPORATIVERIGIDMEDIAAIRCOOLER : any =  { type:3, value:'DIRECTEVAPORATIVERIGIDMEDIAAIRCOOLER'}; static DIRECTEVAPORATIVESLINGERSPACKAGEDAIRCOOLER : any =  { type:3, value:'DIRECTEVAPORATIVESLINGERSPACKAGEDAIRCOOLER'}; static DIRECTEVAPORATIVEPACKAGEDROTARYAIRCOOLER : any =  { type:3, value:'DIRECTEVAPORATIVEPACKAGEDROTARYAIRCOOLER'}; static DIRECTEVAPORATIVEAIRWASHER : any =  { type:3, value:'DIRECTEVAPORATIVEAIRWASHER'}; static INDIRECTEVAPORATIVEPACKAGEAIRCOOLER : any =  { type:3, value:'INDIRECTEVAPORATIVEPACKAGEAIRCOOLER'}; static INDIRECTEVAPORATIVEWETCOIL : any =  { type:3, value:'INDIRECTEVAPORATIVEWETCOIL'}; static INDIRECTEVAPORATIVECOOLINGTOWERORCOILCOOLER : any =  { type:3, value:'INDIRECTEVAPORATIVECOOLINGTOWERORCOILCOOLER'}; static INDIRECTDIRECTCOMBINATION : any =  { type:3, value:'INDIRECTDIRECTCOMBINATION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcEvaporatorTypeEnum {
	static DIRECTEXPANSIONSHELLANDTUBE : any =  { type:3, value:'DIRECTEXPANSIONSHELLANDTUBE'}; static DIRECTEXPANSIONTUBEINTUBE : any =  { type:3, value:'DIRECTEXPANSIONTUBEINTUBE'}; static DIRECTEXPANSIONBRAZEDPLATE : any =  { type:3, value:'DIRECTEXPANSIONBRAZEDPLATE'}; static FLOODEDSHELLANDTUBE : any =  { type:3, value:'FLOODEDSHELLANDTUBE'}; static SHELLANDCOIL : any =  { type:3, value:'SHELLANDCOIL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcFanTypeEnum {
	static CENTRIFUGALFORWARDCURVED : any =  { type:3, value:'CENTRIFUGALFORWARDCURVED'}; static CENTRIFUGALRADIAL : any =  { type:3, value:'CENTRIFUGALRADIAL'}; static CENTRIFUGALBACKWARDINCLINEDCURVED : any =  { type:3, value:'CENTRIFUGALBACKWARDINCLINEDCURVED'}; static CENTRIFUGALAIRFOIL : any =  { type:3, value:'CENTRIFUGALAIRFOIL'}; static TUBEAXIAL : any =  { type:3, value:'TUBEAXIAL'}; static VANEAXIAL : any =  { type:3, value:'VANEAXIAL'}; static PROPELLORAXIAL : any =  { type:3, value:'PROPELLORAXIAL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcFilterTypeEnum {
	static AIRPARTICLEFILTER : any =  { type:3, value:'AIRPARTICLEFILTER'}; static ODORFILTER : any =  { type:3, value:'ODORFILTER'}; static OILFILTER : any =  { type:3, value:'OILFILTER'}; static STRAINER : any =  { type:3, value:'STRAINER'}; static WATERFILTER : any =  { type:3, value:'WATERFILTER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcFireSuppressionTerminalTypeEnum {
	static BREECHINGINLET : any =  { type:3, value:'BREECHINGINLET'}; static FIREHYDRANT : any =  { type:3, value:'FIREHYDRANT'}; static HOSEREEL : any =  { type:3, value:'HOSEREEL'}; static SPRINKLER : any =  { type:3, value:'SPRINKLER'}; static SPRINKLERDEFLECTOR : any =  { type:3, value:'SPRINKLERDEFLECTOR'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcFlowDirectionEnum {
	static SOURCE : any =  { type:3, value:'SOURCE'}; static SINK : any =  { type:3, value:'SINK'}; static SOURCEANDSINK : any =  { type:3, value:'SOURCEANDSINK'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcFlowInstrumentTypeEnum {
	static PRESSUREGAUGE : any =  { type:3, value:'PRESSUREGAUGE'}; static THERMOMETER : any =  { type:3, value:'THERMOMETER'}; static AMMETER : any =  { type:3, value:'AMMETER'}; static FREQUENCYMETER : any =  { type:3, value:'FREQUENCYMETER'}; static POWERFACTORMETER : any =  { type:3, value:'POWERFACTORMETER'}; static PHASEANGLEMETER : any =  { type:3, value:'PHASEANGLEMETER'}; static VOLTMETER_PEAK : any =  { type:3, value:'VOLTMETER_PEAK'}; static VOLTMETER_RMS : any =  { type:3, value:'VOLTMETER_RMS'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcFlowMeterTypeEnum {
	static ELECTRICMETER : any =  { type:3, value:'ELECTRICMETER'}; static ENERGYMETER : any =  { type:3, value:'ENERGYMETER'}; static FLOWMETER : any =  { type:3, value:'FLOWMETER'}; static GASMETER : any =  { type:3, value:'GASMETER'}; static OILMETER : any =  { type:3, value:'OILMETER'}; static WATERMETER : any =  { type:3, value:'WATERMETER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcFootingTypeEnum {
	static FOOTING_BEAM : any =  { type:3, value:'FOOTING_BEAM'}; static PAD_FOOTING : any =  { type:3, value:'PAD_FOOTING'}; static PILE_CAP : any =  { type:3, value:'PILE_CAP'}; static STRIP_FOOTING : any =  { type:3, value:'STRIP_FOOTING'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcGasTerminalTypeEnum {
	static GASAPPLIANCE : any =  { type:3, value:'GASAPPLIANCE'}; static GASBOOSTER : any =  { type:3, value:'GASBOOSTER'}; static GASBURNER : any =  { type:3, value:'GASBURNER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcGeometricProjectionEnum {
	static GRAPH_VIEW : any =  { type:3, value:'GRAPH_VIEW'}; static SKETCH_VIEW : any =  { type:3, value:'SKETCH_VIEW'}; static MODEL_VIEW : any =  { type:3, value:'MODEL_VIEW'}; static PLAN_VIEW : any =  { type:3, value:'PLAN_VIEW'}; static REFLECTED_PLAN_VIEW : any =  { type:3, value:'REFLECTED_PLAN_VIEW'}; static SECTION_VIEW : any =  { type:3, value:'SECTION_VIEW'}; static ELEVATION_VIEW : any =  { type:3, value:'ELEVATION_VIEW'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcGlobalOrLocalEnum {
	static GLOBAL_COORDS : any =  { type:3, value:'GLOBAL_COORDS'}; static LOCAL_COORDS : any =  { type:3, value:'LOCAL_COORDS'}; 
}
export class IfcHeatExchangerTypeEnum {
	static PLATE : any =  { type:3, value:'PLATE'}; static SHELLANDTUBE : any =  { type:3, value:'SHELLANDTUBE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcHumidifierTypeEnum {
	static STEAMINJECTION : any =  { type:3, value:'STEAMINJECTION'}; static ADIABATICAIRWASHER : any =  { type:3, value:'ADIABATICAIRWASHER'}; static ADIABATICPAN : any =  { type:3, value:'ADIABATICPAN'}; static ADIABATICWETTEDELEMENT : any =  { type:3, value:'ADIABATICWETTEDELEMENT'}; static ADIABATICATOMIZING : any =  { type:3, value:'ADIABATICATOMIZING'}; static ADIABATICULTRASONIC : any =  { type:3, value:'ADIABATICULTRASONIC'}; static ADIABATICRIGIDMEDIA : any =  { type:3, value:'ADIABATICRIGIDMEDIA'}; static ADIABATICCOMPRESSEDAIRNOZZLE : any =  { type:3, value:'ADIABATICCOMPRESSEDAIRNOZZLE'}; static ASSISTEDELECTRIC : any =  { type:3, value:'ASSISTEDELECTRIC'}; static ASSISTEDNATURALGAS : any =  { type:3, value:'ASSISTEDNATURALGAS'}; static ASSISTEDPROPANE : any =  { type:3, value:'ASSISTEDPROPANE'}; static ASSISTEDBUTANE : any =  { type:3, value:'ASSISTEDBUTANE'}; static ASSISTEDSTEAM : any =  { type:3, value:'ASSISTEDSTEAM'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcInternalOrExternalEnum {
	static INTERNAL : any =  { type:3, value:'INTERNAL'}; static EXTERNAL : any =  { type:3, value:'EXTERNAL'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcInventoryTypeEnum {
	static ASSETINVENTORY : any =  { type:3, value:'ASSETINVENTORY'}; static SPACEINVENTORY : any =  { type:3, value:'SPACEINVENTORY'}; static FURNITUREINVENTORY : any =  { type:3, value:'FURNITUREINVENTORY'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcJunctionBoxTypeEnum {
	static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcLampTypeEnum {
	static COMPACTFLUORESCENT : any =  { type:3, value:'COMPACTFLUORESCENT'}; static FLUORESCENT : any =  { type:3, value:'FLUORESCENT'}; static HIGHPRESSUREMERCURY : any =  { type:3, value:'HIGHPRESSUREMERCURY'}; static HIGHPRESSURESODIUM : any =  { type:3, value:'HIGHPRESSURESODIUM'}; static METALHALIDE : any =  { type:3, value:'METALHALIDE'}; static TUNGSTENFILAMENT : any =  { type:3, value:'TUNGSTENFILAMENT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcLayerSetDirectionEnum {
	static AXIS1 : any =  { type:3, value:'AXIS1'}; static AXIS2 : any =  { type:3, value:'AXIS2'}; static AXIS3 : any =  { type:3, value:'AXIS3'}; 
}
export class IfcLightDistributionCurveEnum {
	static TYPE_A : any =  { type:3, value:'TYPE_A'}; static TYPE_B : any =  { type:3, value:'TYPE_B'}; static TYPE_C : any =  { type:3, value:'TYPE_C'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcLightEmissionSourceEnum {
	static COMPACTFLUORESCENT : any =  { type:3, value:'COMPACTFLUORESCENT'}; static FLUORESCENT : any =  { type:3, value:'FLUORESCENT'}; static HIGHPRESSUREMERCURY : any =  { type:3, value:'HIGHPRESSUREMERCURY'}; static HIGHPRESSURESODIUM : any =  { type:3, value:'HIGHPRESSURESODIUM'}; static LIGHTEMITTINGDIODE : any =  { type:3, value:'LIGHTEMITTINGDIODE'}; static LOWPRESSURESODIUM : any =  { type:3, value:'LOWPRESSURESODIUM'}; static LOWVOLTAGEHALOGEN : any =  { type:3, value:'LOWVOLTAGEHALOGEN'}; static MAINVOLTAGEHALOGEN : any =  { type:3, value:'MAINVOLTAGEHALOGEN'}; static METALHALIDE : any =  { type:3, value:'METALHALIDE'}; static TUNGSTENFILAMENT : any =  { type:3, value:'TUNGSTENFILAMENT'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcLightFixtureTypeEnum {
	static POINTSOURCE : any =  { type:3, value:'POINTSOURCE'}; static DIRECTIONSOURCE : any =  { type:3, value:'DIRECTIONSOURCE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcLoadGroupTypeEnum {
	static LOAD_GROUP : any =  { type:3, value:'LOAD_GROUP'}; static LOAD_CASE : any =  { type:3, value:'LOAD_CASE'}; static LOAD_COMBINATION_GROUP : any =  { type:3, value:'LOAD_COMBINATION_GROUP'}; static LOAD_COMBINATION : any =  { type:3, value:'LOAD_COMBINATION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcLogicalOperatorEnum {
	static LOGICALAND : any =  { type:3, value:'LOGICALAND'}; static LOGICALOR : any =  { type:3, value:'LOGICALOR'}; 
}
export class IfcMemberTypeEnum {
	static BRACE : any =  { type:3, value:'BRACE'}; static CHORD : any =  { type:3, value:'CHORD'}; static COLLAR : any =  { type:3, value:'COLLAR'}; static MEMBER : any =  { type:3, value:'MEMBER'}; static MULLION : any =  { type:3, value:'MULLION'}; static PLATE : any =  { type:3, value:'PLATE'}; static POST : any =  { type:3, value:'POST'}; static PURLIN : any =  { type:3, value:'PURLIN'}; static RAFTER : any =  { type:3, value:'RAFTER'}; static STRINGER : any =  { type:3, value:'STRINGER'}; static STRUT : any =  { type:3, value:'STRUT'}; static STUD : any =  { type:3, value:'STUD'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcMotorConnectionTypeEnum {
	static BELTDRIVE : any =  { type:3, value:'BELTDRIVE'}; static COUPLING : any =  { type:3, value:'COUPLING'}; static DIRECTDRIVE : any =  { type:3, value:'DIRECTDRIVE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcNullStyle {
	static NULL : any =  { type:3, value:'NULL'}; 
}
export class IfcObjectTypeEnum {
	static PRODUCT : any =  { type:3, value:'PRODUCT'}; static PROCESS : any =  { type:3, value:'PROCESS'}; static CONTROL : any =  { type:3, value:'CONTROL'}; static RESOURCE : any =  { type:3, value:'RESOURCE'}; static ACTOR : any =  { type:3, value:'ACTOR'}; static GROUP : any =  { type:3, value:'GROUP'}; static PROJECT : any =  { type:3, value:'PROJECT'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcObjectiveEnum {
	static CODECOMPLIANCE : any =  { type:3, value:'CODECOMPLIANCE'}; static DESIGNINTENT : any =  { type:3, value:'DESIGNINTENT'}; static HEALTHANDSAFETY : any =  { type:3, value:'HEALTHANDSAFETY'}; static REQUIREMENT : any =  { type:3, value:'REQUIREMENT'}; static SPECIFICATION : any =  { type:3, value:'SPECIFICATION'}; static TRIGGERCONDITION : any =  { type:3, value:'TRIGGERCONDITION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcOccupantTypeEnum {
	static ASSIGNEE : any =  { type:3, value:'ASSIGNEE'}; static ASSIGNOR : any =  { type:3, value:'ASSIGNOR'}; static LESSEE : any =  { type:3, value:'LESSEE'}; static LESSOR : any =  { type:3, value:'LESSOR'}; static LETTINGAGENT : any =  { type:3, value:'LETTINGAGENT'}; static OWNER : any =  { type:3, value:'OWNER'}; static TENANT : any =  { type:3, value:'TENANT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcOutletTypeEnum {
	static AUDIOVISUALOUTLET : any =  { type:3, value:'AUDIOVISUALOUTLET'}; static COMMUNICATIONSOUTLET : any =  { type:3, value:'COMMUNICATIONSOUTLET'}; static POWEROUTLET : any =  { type:3, value:'POWEROUTLET'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPermeableCoveringOperationEnum {
	static GRILL : any =  { type:3, value:'GRILL'}; static LOUVER : any =  { type:3, value:'LOUVER'}; static SCREEN : any =  { type:3, value:'SCREEN'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPhysicalOrVirtualEnum {
	static PHYSICAL : any =  { type:3, value:'PHYSICAL'}; static VIRTUAL : any =  { type:3, value:'VIRTUAL'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPileConstructionEnum {
	static CAST_IN_PLACE : any =  { type:3, value:'CAST_IN_PLACE'}; static COMPOSITE : any =  { type:3, value:'COMPOSITE'}; static PRECAST_CONCRETE : any =  { type:3, value:'PRECAST_CONCRETE'}; static PREFAB_STEEL : any =  { type:3, value:'PREFAB_STEEL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPileTypeEnum {
	static COHESION : any =  { type:3, value:'COHESION'}; static FRICTION : any =  { type:3, value:'FRICTION'}; static SUPPORT : any =  { type:3, value:'SUPPORT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPipeFittingTypeEnum {
	static BEND : any =  { type:3, value:'BEND'}; static CONNECTOR : any =  { type:3, value:'CONNECTOR'}; static ENTRY : any =  { type:3, value:'ENTRY'}; static EXIT : any =  { type:3, value:'EXIT'}; static JUNCTION : any =  { type:3, value:'JUNCTION'}; static OBSTRUCTION : any =  { type:3, value:'OBSTRUCTION'}; static TRANSITION : any =  { type:3, value:'TRANSITION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPipeSegmentTypeEnum {
	static FLEXIBLESEGMENT : any =  { type:3, value:'FLEXIBLESEGMENT'}; static RIGIDSEGMENT : any =  { type:3, value:'RIGIDSEGMENT'}; static GUTTER : any =  { type:3, value:'GUTTER'}; static SPOOL : any =  { type:3, value:'SPOOL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPlateTypeEnum {
	static CURTAIN_PANEL : any =  { type:3, value:'CURTAIN_PANEL'}; static SHEET : any =  { type:3, value:'SHEET'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcProcedureTypeEnum {
	static ADVICE_CAUTION : any =  { type:3, value:'ADVICE_CAUTION'}; static ADVICE_NOTE : any =  { type:3, value:'ADVICE_NOTE'}; static ADVICE_WARNING : any =  { type:3, value:'ADVICE_WARNING'}; static CALIBRATION : any =  { type:3, value:'CALIBRATION'}; static DIAGNOSTIC : any =  { type:3, value:'DIAGNOSTIC'}; static SHUTDOWN : any =  { type:3, value:'SHUTDOWN'}; static STARTUP : any =  { type:3, value:'STARTUP'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcProfileTypeEnum {
	static CURVE : any =  { type:3, value:'CURVE'}; static AREA : any =  { type:3, value:'AREA'}; 
}
export class IfcProjectOrderRecordTypeEnum {
	static CHANGE : any =  { type:3, value:'CHANGE'}; static MAINTENANCE : any =  { type:3, value:'MAINTENANCE'}; static MOVE : any =  { type:3, value:'MOVE'}; static PURCHASE : any =  { type:3, value:'PURCHASE'}; static WORK : any =  { type:3, value:'WORK'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcProjectOrderTypeEnum {
	static CHANGEORDER : any =  { type:3, value:'CHANGEORDER'}; static MAINTENANCEWORKORDER : any =  { type:3, value:'MAINTENANCEWORKORDER'}; static MOVEORDER : any =  { type:3, value:'MOVEORDER'}; static PURCHASEORDER : any =  { type:3, value:'PURCHASEORDER'}; static WORKORDER : any =  { type:3, value:'WORKORDER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcProjectedOrTrueLengthEnum {
	static PROJECTED_LENGTH : any =  { type:3, value:'PROJECTED_LENGTH'}; static TRUE_LENGTH : any =  { type:3, value:'TRUE_LENGTH'}; 
}
export class IfcPropertySourceEnum {
	static DESIGN : any =  { type:3, value:'DESIGN'}; static DESIGNMAXIMUM : any =  { type:3, value:'DESIGNMAXIMUM'}; static DESIGNMINIMUM : any =  { type:3, value:'DESIGNMINIMUM'}; static SIMULATED : any =  { type:3, value:'SIMULATED'}; static ASBUILT : any =  { type:3, value:'ASBUILT'}; static COMMISSIONING : any =  { type:3, value:'COMMISSIONING'}; static MEASURED : any =  { type:3, value:'MEASURED'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTKNOWN : any =  { type:3, value:'NOTKNOWN'}; 
}
export class IfcProtectiveDeviceTypeEnum {
	static FUSEDISCONNECTOR : any =  { type:3, value:'FUSEDISCONNECTOR'}; static CIRCUITBREAKER : any =  { type:3, value:'CIRCUITBREAKER'}; static EARTHFAILUREDEVICE : any =  { type:3, value:'EARTHFAILUREDEVICE'}; static RESIDUALCURRENTCIRCUITBREAKER : any =  { type:3, value:'RESIDUALCURRENTCIRCUITBREAKER'}; static RESIDUALCURRENTSWITCH : any =  { type:3, value:'RESIDUALCURRENTSWITCH'}; static VARISTOR : any =  { type:3, value:'VARISTOR'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPumpTypeEnum {
	static CIRCULATOR : any =  { type:3, value:'CIRCULATOR'}; static ENDSUCTION : any =  { type:3, value:'ENDSUCTION'}; static SPLITCASE : any =  { type:3, value:'SPLITCASE'}; static VERTICALINLINE : any =  { type:3, value:'VERTICALINLINE'}; static VERTICALTURBINE : any =  { type:3, value:'VERTICALTURBINE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcRailingTypeEnum {
	static HANDRAIL : any =  { type:3, value:'HANDRAIL'}; static GUARDRAIL : any =  { type:3, value:'GUARDRAIL'}; static BALUSTRADE : any =  { type:3, value:'BALUSTRADE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcRampFlightTypeEnum {
	static STRAIGHT : any =  { type:3, value:'STRAIGHT'}; static SPIRAL : any =  { type:3, value:'SPIRAL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcRampTypeEnum {
	static STRAIGHT_RUN_RAMP : any =  { type:3, value:'STRAIGHT_RUN_RAMP'}; static TWO_STRAIGHT_RUN_RAMP : any =  { type:3, value:'TWO_STRAIGHT_RUN_RAMP'}; static QUARTER_TURN_RAMP : any =  { type:3, value:'QUARTER_TURN_RAMP'}; static TWO_QUARTER_TURN_RAMP : any =  { type:3, value:'TWO_QUARTER_TURN_RAMP'}; static HALF_TURN_RAMP : any =  { type:3, value:'HALF_TURN_RAMP'}; static SPIRAL_RAMP : any =  { type:3, value:'SPIRAL_RAMP'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcReflectanceMethodEnum {
	static BLINN : any =  { type:3, value:'BLINN'}; static FLAT : any =  { type:3, value:'FLAT'}; static GLASS : any =  { type:3, value:'GLASS'}; static MATT : any =  { type:3, value:'MATT'}; static METAL : any =  { type:3, value:'METAL'}; static MIRROR : any =  { type:3, value:'MIRROR'}; static PHONG : any =  { type:3, value:'PHONG'}; static PLASTIC : any =  { type:3, value:'PLASTIC'}; static STRAUSS : any =  { type:3, value:'STRAUSS'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcReinforcingBarRoleEnum {
	static MAIN : any =  { type:3, value:'MAIN'}; static SHEAR : any =  { type:3, value:'SHEAR'}; static LIGATURE : any =  { type:3, value:'LIGATURE'}; static STUD : any =  { type:3, value:'STUD'}; static PUNCHING : any =  { type:3, value:'PUNCHING'}; static EDGE : any =  { type:3, value:'EDGE'}; static RING : any =  { type:3, value:'RING'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcReinforcingBarSurfaceEnum {
	static PLAIN : any =  { type:3, value:'PLAIN'}; static TEXTURED : any =  { type:3, value:'TEXTURED'}; 
}
export class IfcResourceConsumptionEnum {
	static CONSUMED : any =  { type:3, value:'CONSUMED'}; static PARTIALLYCONSUMED : any =  { type:3, value:'PARTIALLYCONSUMED'}; static NOTCONSUMED : any =  { type:3, value:'NOTCONSUMED'}; static OCCUPIED : any =  { type:3, value:'OCCUPIED'}; static PARTIALLYOCCUPIED : any =  { type:3, value:'PARTIALLYOCCUPIED'}; static NOTOCCUPIED : any =  { type:3, value:'NOTOCCUPIED'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcRibPlateDirectionEnum {
	static DIRECTION_X : any =  { type:3, value:'DIRECTION_X'}; static DIRECTION_Y : any =  { type:3, value:'DIRECTION_Y'}; 
}
export class IfcRoleEnum {
	static SUPPLIER : any =  { type:3, value:'SUPPLIER'}; static MANUFACTURER : any =  { type:3, value:'MANUFACTURER'}; static CONTRACTOR : any =  { type:3, value:'CONTRACTOR'}; static SUBCONTRACTOR : any =  { type:3, value:'SUBCONTRACTOR'}; static ARCHITECT : any =  { type:3, value:'ARCHITECT'}; static STRUCTURALENGINEER : any =  { type:3, value:'STRUCTURALENGINEER'}; static COSTENGINEER : any =  { type:3, value:'COSTENGINEER'}; static CLIENT : any =  { type:3, value:'CLIENT'}; static BUILDINGOWNER : any =  { type:3, value:'BUILDINGOWNER'}; static BUILDINGOPERATOR : any =  { type:3, value:'BUILDINGOPERATOR'}; static MECHANICALENGINEER : any =  { type:3, value:'MECHANICALENGINEER'}; static ELECTRICALENGINEER : any =  { type:3, value:'ELECTRICALENGINEER'}; static PROJECTMANAGER : any =  { type:3, value:'PROJECTMANAGER'}; static FACILITIESMANAGER : any =  { type:3, value:'FACILITIESMANAGER'}; static CIVILENGINEER : any =  { type:3, value:'CIVILENGINEER'}; static COMISSIONINGENGINEER : any =  { type:3, value:'COMISSIONINGENGINEER'}; static ENGINEER : any =  { type:3, value:'ENGINEER'}; static OWNER : any =  { type:3, value:'OWNER'}; static CONSULTANT : any =  { type:3, value:'CONSULTANT'}; static CONSTRUCTIONMANAGER : any =  { type:3, value:'CONSTRUCTIONMANAGER'}; static FIELDCONSTRUCTIONMANAGER : any =  { type:3, value:'FIELDCONSTRUCTIONMANAGER'}; static RESELLER : any =  { type:3, value:'RESELLER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; 
}
export class IfcRoofTypeEnum {
	static FLAT_ROOF : any =  { type:3, value:'FLAT_ROOF'}; static SHED_ROOF : any =  { type:3, value:'SHED_ROOF'}; static GABLE_ROOF : any =  { type:3, value:'GABLE_ROOF'}; static HIP_ROOF : any =  { type:3, value:'HIP_ROOF'}; static HIPPED_GABLE_ROOF : any =  { type:3, value:'HIPPED_GABLE_ROOF'}; static GAMBREL_ROOF : any =  { type:3, value:'GAMBREL_ROOF'}; static MANSARD_ROOF : any =  { type:3, value:'MANSARD_ROOF'}; static BARREL_ROOF : any =  { type:3, value:'BARREL_ROOF'}; static RAINBOW_ROOF : any =  { type:3, value:'RAINBOW_ROOF'}; static BUTTERFLY_ROOF : any =  { type:3, value:'BUTTERFLY_ROOF'}; static PAVILION_ROOF : any =  { type:3, value:'PAVILION_ROOF'}; static DOME_ROOF : any =  { type:3, value:'DOME_ROOF'}; static FREEFORM : any =  { type:3, value:'FREEFORM'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSIPrefix {
	static EXA : any =  { type:3, value:'EXA'}; static PETA : any =  { type:3, value:'PETA'}; static TERA : any =  { type:3, value:'TERA'}; static GIGA : any =  { type:3, value:'GIGA'}; static MEGA : any =  { type:3, value:'MEGA'}; static KILO : any =  { type:3, value:'KILO'}; static HECTO : any =  { type:3, value:'HECTO'}; static DECA : any =  { type:3, value:'DECA'}; static DECI : any =  { type:3, value:'DECI'}; static CENTI : any =  { type:3, value:'CENTI'}; static MILLI : any =  { type:3, value:'MILLI'}; static MICRO : any =  { type:3, value:'MICRO'}; static NANO : any =  { type:3, value:'NANO'}; static PICO : any =  { type:3, value:'PICO'}; static FEMTO : any =  { type:3, value:'FEMTO'}; static ATTO : any =  { type:3, value:'ATTO'}; 
}
export class IfcSIUnitName {
	static AMPERE : any =  { type:3, value:'AMPERE'}; static BECQUEREL : any =  { type:3, value:'BECQUEREL'}; static CANDELA : any =  { type:3, value:'CANDELA'}; static COULOMB : any =  { type:3, value:'COULOMB'}; static CUBIC_METRE : any =  { type:3, value:'CUBIC_METRE'}; static DEGREE_CELSIUS : any =  { type:3, value:'DEGREE_CELSIUS'}; static FARAD : any =  { type:3, value:'FARAD'}; static GRAM : any =  { type:3, value:'GRAM'}; static GRAY : any =  { type:3, value:'GRAY'}; static HENRY : any =  { type:3, value:'HENRY'}; static HERTZ : any =  { type:3, value:'HERTZ'}; static JOULE : any =  { type:3, value:'JOULE'}; static KELVIN : any =  { type:3, value:'KELVIN'}; static LUMEN : any =  { type:3, value:'LUMEN'}; static LUX : any =  { type:3, value:'LUX'}; static METRE : any =  { type:3, value:'METRE'}; static MOLE : any =  { type:3, value:'MOLE'}; static NEWTON : any =  { type:3, value:'NEWTON'}; static OHM : any =  { type:3, value:'OHM'}; static PASCAL : any =  { type:3, value:'PASCAL'}; static RADIAN : any =  { type:3, value:'RADIAN'}; static SECOND : any =  { type:3, value:'SECOND'}; static SIEMENS : any =  { type:3, value:'SIEMENS'}; static SIEVERT : any =  { type:3, value:'SIEVERT'}; static SQUARE_METRE : any =  { type:3, value:'SQUARE_METRE'}; static STERADIAN : any =  { type:3, value:'STERADIAN'}; static TESLA : any =  { type:3, value:'TESLA'}; static VOLT : any =  { type:3, value:'VOLT'}; static WATT : any =  { type:3, value:'WATT'}; static WEBER : any =  { type:3, value:'WEBER'}; 
}
export class IfcSanitaryTerminalTypeEnum {
	static BATH : any =  { type:3, value:'BATH'}; static BIDET : any =  { type:3, value:'BIDET'}; static CISTERN : any =  { type:3, value:'CISTERN'}; static SHOWER : any =  { type:3, value:'SHOWER'}; static SINK : any =  { type:3, value:'SINK'}; static SANITARYFOUNTAIN : any =  { type:3, value:'SANITARYFOUNTAIN'}; static TOILETPAN : any =  { type:3, value:'TOILETPAN'}; static URINAL : any =  { type:3, value:'URINAL'}; static WASHHANDBASIN : any =  { type:3, value:'WASHHANDBASIN'}; static WCSEAT : any =  { type:3, value:'WCSEAT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSectionTypeEnum {
	static UNIFORM : any =  { type:3, value:'UNIFORM'}; static TAPERED : any =  { type:3, value:'TAPERED'}; 
}
export class IfcSensorTypeEnum {
	static CO2SENSOR : any =  { type:3, value:'CO2SENSOR'}; static FIRESENSOR : any =  { type:3, value:'FIRESENSOR'}; static FLOWSENSOR : any =  { type:3, value:'FLOWSENSOR'}; static GASSENSOR : any =  { type:3, value:'GASSENSOR'}; static HEATSENSOR : any =  { type:3, value:'HEATSENSOR'}; static HUMIDITYSENSOR : any =  { type:3, value:'HUMIDITYSENSOR'}; static LIGHTSENSOR : any =  { type:3, value:'LIGHTSENSOR'}; static MOISTURESENSOR : any =  { type:3, value:'MOISTURESENSOR'}; static MOVEMENTSENSOR : any =  { type:3, value:'MOVEMENTSENSOR'}; static PRESSURESENSOR : any =  { type:3, value:'PRESSURESENSOR'}; static SMOKESENSOR : any =  { type:3, value:'SMOKESENSOR'}; static SOUNDSENSOR : any =  { type:3, value:'SOUNDSENSOR'}; static TEMPERATURESENSOR : any =  { type:3, value:'TEMPERATURESENSOR'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSequenceEnum {
	static START_START : any =  { type:3, value:'START_START'}; static START_FINISH : any =  { type:3, value:'START_FINISH'}; static FINISH_START : any =  { type:3, value:'FINISH_START'}; static FINISH_FINISH : any =  { type:3, value:'FINISH_FINISH'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcServiceLifeFactorTypeEnum {
	static A_QUALITYOFCOMPONENTS : any =  { type:3, value:'A_QUALITYOFCOMPONENTS'}; static B_DESIGNLEVEL : any =  { type:3, value:'B_DESIGNLEVEL'}; static C_WORKEXECUTIONLEVEL : any =  { type:3, value:'C_WORKEXECUTIONLEVEL'}; static D_INDOORENVIRONMENT : any =  { type:3, value:'D_INDOORENVIRONMENT'}; static E_OUTDOORENVIRONMENT : any =  { type:3, value:'E_OUTDOORENVIRONMENT'}; static F_INUSECONDITIONS : any =  { type:3, value:'F_INUSECONDITIONS'}; static G_MAINTENANCELEVEL : any =  { type:3, value:'G_MAINTENANCELEVEL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcServiceLifeTypeEnum {
	static ACTUALSERVICELIFE : any =  { type:3, value:'ACTUALSERVICELIFE'}; static EXPECTEDSERVICELIFE : any =  { type:3, value:'EXPECTEDSERVICELIFE'}; static OPTIMISTICREFERENCESERVICELIFE : any =  { type:3, value:'OPTIMISTICREFERENCESERVICELIFE'}; static PESSIMISTICREFERENCESERVICELIFE : any =  { type:3, value:'PESSIMISTICREFERENCESERVICELIFE'}; static REFERENCESERVICELIFE : any =  { type:3, value:'REFERENCESERVICELIFE'}; 
}
export class IfcSlabTypeEnum {
	static FLOOR : any =  { type:3, value:'FLOOR'}; static ROOF : any =  { type:3, value:'ROOF'}; static LANDING : any =  { type:3, value:'LANDING'}; static BASESLAB : any =  { type:3, value:'BASESLAB'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSoundScaleEnum {
	static DBA : any =  { type:3, value:'DBA'}; static DBB : any =  { type:3, value:'DBB'}; static DBC : any =  { type:3, value:'DBC'}; static NC : any =  { type:3, value:'NC'}; static NR : any =  { type:3, value:'NR'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSpaceHeaterTypeEnum {
	static SECTIONALRADIATOR : any =  { type:3, value:'SECTIONALRADIATOR'}; static PANELRADIATOR : any =  { type:3, value:'PANELRADIATOR'}; static TUBULARRADIATOR : any =  { type:3, value:'TUBULARRADIATOR'}; static CONVECTOR : any =  { type:3, value:'CONVECTOR'}; static BASEBOARDHEATER : any =  { type:3, value:'BASEBOARDHEATER'}; static FINNEDTUBEUNIT : any =  { type:3, value:'FINNEDTUBEUNIT'}; static UNITHEATER : any =  { type:3, value:'UNITHEATER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSpaceTypeEnum {
	static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcStackTerminalTypeEnum {
	static BIRDCAGE : any =  { type:3, value:'BIRDCAGE'}; static COWL : any =  { type:3, value:'COWL'}; static RAINWATERHOPPER : any =  { type:3, value:'RAINWATERHOPPER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcStairFlightTypeEnum {
	static STRAIGHT : any =  { type:3, value:'STRAIGHT'}; static WINDER : any =  { type:3, value:'WINDER'}; static SPIRAL : any =  { type:3, value:'SPIRAL'}; static CURVED : any =  { type:3, value:'CURVED'}; static FREEFORM : any =  { type:3, value:'FREEFORM'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcStairTypeEnum {
	static STRAIGHT_RUN_STAIR : any =  { type:3, value:'STRAIGHT_RUN_STAIR'}; static TWO_STRAIGHT_RUN_STAIR : any =  { type:3, value:'TWO_STRAIGHT_RUN_STAIR'}; static QUARTER_WINDING_STAIR : any =  { type:3, value:'QUARTER_WINDING_STAIR'}; static QUARTER_TURN_STAIR : any =  { type:3, value:'QUARTER_TURN_STAIR'}; static HALF_WINDING_STAIR : any =  { type:3, value:'HALF_WINDING_STAIR'}; static HALF_TURN_STAIR : any =  { type:3, value:'HALF_TURN_STAIR'}; static TWO_QUARTER_WINDING_STAIR : any =  { type:3, value:'TWO_QUARTER_WINDING_STAIR'}; static TWO_QUARTER_TURN_STAIR : any =  { type:3, value:'TWO_QUARTER_TURN_STAIR'}; static THREE_QUARTER_WINDING_STAIR : any =  { type:3, value:'THREE_QUARTER_WINDING_STAIR'}; static THREE_QUARTER_TURN_STAIR : any =  { type:3, value:'THREE_QUARTER_TURN_STAIR'}; static SPIRAL_STAIR : any =  { type:3, value:'SPIRAL_STAIR'}; static DOUBLE_RETURN_STAIR : any =  { type:3, value:'DOUBLE_RETURN_STAIR'}; static CURVED_RUN_STAIR : any =  { type:3, value:'CURVED_RUN_STAIR'}; static TWO_CURVED_RUN_STAIR : any =  { type:3, value:'TWO_CURVED_RUN_STAIR'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcStateEnum {
	static READWRITE : any =  { type:3, value:'READWRITE'}; static READONLY : any =  { type:3, value:'READONLY'}; static LOCKED : any =  { type:3, value:'LOCKED'}; static READWRITELOCKED : any =  { type:3, value:'READWRITELOCKED'}; static READONLYLOCKED : any =  { type:3, value:'READONLYLOCKED'}; 
}
export class IfcStructuralCurveTypeEnum {
	static RIGID_JOINED_MEMBER : any =  { type:3, value:'RIGID_JOINED_MEMBER'}; static PIN_JOINED_MEMBER : any =  { type:3, value:'PIN_JOINED_MEMBER'}; static CABLE : any =  { type:3, value:'CABLE'}; static TENSION_MEMBER : any =  { type:3, value:'TENSION_MEMBER'}; static COMPRESSION_MEMBER : any =  { type:3, value:'COMPRESSION_MEMBER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcStructuralSurfaceTypeEnum {
	static BENDING_ELEMENT : any =  { type:3, value:'BENDING_ELEMENT'}; static MEMBRANE_ELEMENT : any =  { type:3, value:'MEMBRANE_ELEMENT'}; static SHELL : any =  { type:3, value:'SHELL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSurfaceSide {
	static POSITIVE : any =  { type:3, value:'POSITIVE'}; static NEGATIVE : any =  { type:3, value:'NEGATIVE'}; static BOTH : any =  { type:3, value:'BOTH'}; 
}
export class IfcSurfaceTextureEnum {
	static BUMP : any =  { type:3, value:'BUMP'}; static OPACITY : any =  { type:3, value:'OPACITY'}; static REFLECTION : any =  { type:3, value:'REFLECTION'}; static SELFILLUMINATION : any =  { type:3, value:'SELFILLUMINATION'}; static SHININESS : any =  { type:3, value:'SHININESS'}; static SPECULAR : any =  { type:3, value:'SPECULAR'}; static TEXTURE : any =  { type:3, value:'TEXTURE'}; static TRANSPARENCYMAP : any =  { type:3, value:'TRANSPARENCYMAP'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSwitchingDeviceTypeEnum {
	static CONTACTOR : any =  { type:3, value:'CONTACTOR'}; static EMERGENCYSTOP : any =  { type:3, value:'EMERGENCYSTOP'}; static STARTER : any =  { type:3, value:'STARTER'}; static SWITCHDISCONNECTOR : any =  { type:3, value:'SWITCHDISCONNECTOR'}; static TOGGLESWITCH : any =  { type:3, value:'TOGGLESWITCH'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTankTypeEnum {
	static PREFORMED : any =  { type:3, value:'PREFORMED'}; static SECTIONAL : any =  { type:3, value:'SECTIONAL'}; static EXPANSION : any =  { type:3, value:'EXPANSION'}; static PRESSUREVESSEL : any =  { type:3, value:'PRESSUREVESSEL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTendonTypeEnum {
	static STRAND : any =  { type:3, value:'STRAND'}; static WIRE : any =  { type:3, value:'WIRE'}; static BAR : any =  { type:3, value:'BAR'}; static COATED : any =  { type:3, value:'COATED'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTextPath {
	static LEFT : any =  { type:3, value:'LEFT'}; static RIGHT : any =  { type:3, value:'RIGHT'}; static UP : any =  { type:3, value:'UP'}; static DOWN : any =  { type:3, value:'DOWN'}; 
}
export class IfcThermalLoadSourceEnum {
	static PEOPLE : any =  { type:3, value:'PEOPLE'}; static LIGHTING : any =  { type:3, value:'LIGHTING'}; static EQUIPMENT : any =  { type:3, value:'EQUIPMENT'}; static VENTILATIONINDOORAIR : any =  { type:3, value:'VENTILATIONINDOORAIR'}; static VENTILATIONOUTSIDEAIR : any =  { type:3, value:'VENTILATIONOUTSIDEAIR'}; static RECIRCULATEDAIR : any =  { type:3, value:'RECIRCULATEDAIR'}; static EXHAUSTAIR : any =  { type:3, value:'EXHAUSTAIR'}; static AIREXCHANGERATE : any =  { type:3, value:'AIREXCHANGERATE'}; static DRYBULBTEMPERATURE : any =  { type:3, value:'DRYBULBTEMPERATURE'}; static RELATIVEHUMIDITY : any =  { type:3, value:'RELATIVEHUMIDITY'}; static INFILTRATION : any =  { type:3, value:'INFILTRATION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcThermalLoadTypeEnum {
	static SENSIBLE : any =  { type:3, value:'SENSIBLE'}; static LATENT : any =  { type:3, value:'LATENT'}; static RADIANT : any =  { type:3, value:'RADIANT'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTimeSeriesDataTypeEnum {
	static CONTINUOUS : any =  { type:3, value:'CONTINUOUS'}; static DISCRETE : any =  { type:3, value:'DISCRETE'}; static DISCRETEBINARY : any =  { type:3, value:'DISCRETEBINARY'}; static PIECEWISEBINARY : any =  { type:3, value:'PIECEWISEBINARY'}; static PIECEWISECONSTANT : any =  { type:3, value:'PIECEWISECONSTANT'}; static PIECEWISECONTINUOUS : any =  { type:3, value:'PIECEWISECONTINUOUS'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTimeSeriesScheduleTypeEnum {
	static ANNUAL : any =  { type:3, value:'ANNUAL'}; static MONTHLY : any =  { type:3, value:'MONTHLY'}; static WEEKLY : any =  { type:3, value:'WEEKLY'}; static DAILY : any =  { type:3, value:'DAILY'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTransformerTypeEnum {
	static CURRENT : any =  { type:3, value:'CURRENT'}; static FREQUENCY : any =  { type:3, value:'FREQUENCY'}; static VOLTAGE : any =  { type:3, value:'VOLTAGE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTransitionCode {
	static DISCONTINUOUS : any =  { type:3, value:'DISCONTINUOUS'}; static CONTINUOUS : any =  { type:3, value:'CONTINUOUS'}; static CONTSAMEGRADIENT : any =  { type:3, value:'CONTSAMEGRADIENT'}; static CONTSAMEGRADIENTSAMECURVATURE : any =  { type:3, value:'CONTSAMEGRADIENTSAMECURVATURE'}; 
}
export class IfcTransportElementTypeEnum {
	static ELEVATOR : any =  { type:3, value:'ELEVATOR'}; static ESCALATOR : any =  { type:3, value:'ESCALATOR'}; static MOVINGWALKWAY : any =  { type:3, value:'MOVINGWALKWAY'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTrimmingPreference {
	static CARTESIAN : any =  { type:3, value:'CARTESIAN'}; static PARAMETER : any =  { type:3, value:'PARAMETER'}; static UNSPECIFIED : any =  { type:3, value:'UNSPECIFIED'}; 
}
export class IfcTubeBundleTypeEnum {
	static FINNED : any =  { type:3, value:'FINNED'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcUnitEnum {
	static ABSORBEDDOSEUNIT : any =  { type:3, value:'ABSORBEDDOSEUNIT'}; static AMOUNTOFSUBSTANCEUNIT : any =  { type:3, value:'AMOUNTOFSUBSTANCEUNIT'}; static AREAUNIT : any =  { type:3, value:'AREAUNIT'}; static DOSEEQUIVALENTUNIT : any =  { type:3, value:'DOSEEQUIVALENTUNIT'}; static ELECTRICCAPACITANCEUNIT : any =  { type:3, value:'ELECTRICCAPACITANCEUNIT'}; static ELECTRICCHARGEUNIT : any =  { type:3, value:'ELECTRICCHARGEUNIT'}; static ELECTRICCONDUCTANCEUNIT : any =  { type:3, value:'ELECTRICCONDUCTANCEUNIT'}; static ELECTRICCURRENTUNIT : any =  { type:3, value:'ELECTRICCURRENTUNIT'}; static ELECTRICRESISTANCEUNIT : any =  { type:3, value:'ELECTRICRESISTANCEUNIT'}; static ELECTRICVOLTAGEUNIT : any =  { type:3, value:'ELECTRICVOLTAGEUNIT'}; static ENERGYUNIT : any =  { type:3, value:'ENERGYUNIT'}; static FORCEUNIT : any =  { type:3, value:'FORCEUNIT'}; static FREQUENCYUNIT : any =  { type:3, value:'FREQUENCYUNIT'}; static ILLUMINANCEUNIT : any =  { type:3, value:'ILLUMINANCEUNIT'}; static INDUCTANCEUNIT : any =  { type:3, value:'INDUCTANCEUNIT'}; static LENGTHUNIT : any =  { type:3, value:'LENGTHUNIT'}; static LUMINOUSFLUXUNIT : any =  { type:3, value:'LUMINOUSFLUXUNIT'}; static LUMINOUSINTENSITYUNIT : any =  { type:3, value:'LUMINOUSINTENSITYUNIT'}; static MAGNETICFLUXDENSITYUNIT : any =  { type:3, value:'MAGNETICFLUXDENSITYUNIT'}; static MAGNETICFLUXUNIT : any =  { type:3, value:'MAGNETICFLUXUNIT'}; static MASSUNIT : any =  { type:3, value:'MASSUNIT'}; static PLANEANGLEUNIT : any =  { type:3, value:'PLANEANGLEUNIT'}; static POWERUNIT : any =  { type:3, value:'POWERUNIT'}; static PRESSUREUNIT : any =  { type:3, value:'PRESSUREUNIT'}; static RADIOACTIVITYUNIT : any =  { type:3, value:'RADIOACTIVITYUNIT'}; static SOLIDANGLEUNIT : any =  { type:3, value:'SOLIDANGLEUNIT'}; static THERMODYNAMICTEMPERATUREUNIT : any =  { type:3, value:'THERMODYNAMICTEMPERATUREUNIT'}; static TIMEUNIT : any =  { type:3, value:'TIMEUNIT'}; static VOLUMEUNIT : any =  { type:3, value:'VOLUMEUNIT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; 
}
export class IfcUnitaryEquipmentTypeEnum {
	static AIRHANDLER : any =  { type:3, value:'AIRHANDLER'}; static AIRCONDITIONINGUNIT : any =  { type:3, value:'AIRCONDITIONINGUNIT'}; static SPLITSYSTEM : any =  { type:3, value:'SPLITSYSTEM'}; static ROOFTOPUNIT : any =  { type:3, value:'ROOFTOPUNIT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcValveTypeEnum {
	static AIRRELEASE : any =  { type:3, value:'AIRRELEASE'}; static ANTIVACUUM : any =  { type:3, value:'ANTIVACUUM'}; static CHANGEOVER : any =  { type:3, value:'CHANGEOVER'}; static CHECK : any =  { type:3, value:'CHECK'}; static COMMISSIONING : any =  { type:3, value:'COMMISSIONING'}; static DIVERTING : any =  { type:3, value:'DIVERTING'}; static DRAWOFFCOCK : any =  { type:3, value:'DRAWOFFCOCK'}; static DOUBLECHECK : any =  { type:3, value:'DOUBLECHECK'}; static DOUBLEREGULATING : any =  { type:3, value:'DOUBLEREGULATING'}; static FAUCET : any =  { type:3, value:'FAUCET'}; static FLUSHING : any =  { type:3, value:'FLUSHING'}; static GASCOCK : any =  { type:3, value:'GASCOCK'}; static GASTAP : any =  { type:3, value:'GASTAP'}; static ISOLATING : any =  { type:3, value:'ISOLATING'}; static MIXING : any =  { type:3, value:'MIXING'}; static PRESSUREREDUCING : any =  { type:3, value:'PRESSUREREDUCING'}; static PRESSURERELIEF : any =  { type:3, value:'PRESSURERELIEF'}; static REGULATING : any =  { type:3, value:'REGULATING'}; static SAFETYCUTOFF : any =  { type:3, value:'SAFETYCUTOFF'}; static STEAMTRAP : any =  { type:3, value:'STEAMTRAP'}; static STOPCOCK : any =  { type:3, value:'STOPCOCK'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcVibrationIsolatorTypeEnum {
	static COMPRESSION : any =  { type:3, value:'COMPRESSION'}; static SPRING : any =  { type:3, value:'SPRING'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcWallTypeEnum {
	static STANDARD : any =  { type:3, value:'STANDARD'}; static POLYGONAL : any =  { type:3, value:'POLYGONAL'}; static SHEAR : any =  { type:3, value:'SHEAR'}; static ELEMENTEDWALL : any =  { type:3, value:'ELEMENTEDWALL'}; static PLUMBINGWALL : any =  { type:3, value:'PLUMBINGWALL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcWasteTerminalTypeEnum {
	static FLOORTRAP : any =  { type:3, value:'FLOORTRAP'}; static FLOORWASTE : any =  { type:3, value:'FLOORWASTE'}; static GULLYSUMP : any =  { type:3, value:'GULLYSUMP'}; static GULLYTRAP : any =  { type:3, value:'GULLYTRAP'}; static GREASEINTERCEPTOR : any =  { type:3, value:'GREASEINTERCEPTOR'}; static OILINTERCEPTOR : any =  { type:3, value:'OILINTERCEPTOR'}; static PETROLINTERCEPTOR : any =  { type:3, value:'PETROLINTERCEPTOR'}; static ROOFDRAIN : any =  { type:3, value:'ROOFDRAIN'}; static WASTEDISPOSALUNIT : any =  { type:3, value:'WASTEDISPOSALUNIT'}; static WASTETRAP : any =  { type:3, value:'WASTETRAP'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcWindowPanelOperationEnum {
	static SIDEHUNGRIGHTHAND : any =  { type:3, value:'SIDEHUNGRIGHTHAND'}; static SIDEHUNGLEFTHAND : any =  { type:3, value:'SIDEHUNGLEFTHAND'}; static TILTANDTURNRIGHTHAND : any =  { type:3, value:'TILTANDTURNRIGHTHAND'}; static TILTANDTURNLEFTHAND : any =  { type:3, value:'TILTANDTURNLEFTHAND'}; static TOPHUNG : any =  { type:3, value:'TOPHUNG'}; static BOTTOMHUNG : any =  { type:3, value:'BOTTOMHUNG'}; static PIVOTHORIZONTAL : any =  { type:3, value:'PIVOTHORIZONTAL'}; static PIVOTVERTICAL : any =  { type:3, value:'PIVOTVERTICAL'}; static SLIDINGHORIZONTAL : any =  { type:3, value:'SLIDINGHORIZONTAL'}; static SLIDINGVERTICAL : any =  { type:3, value:'SLIDINGVERTICAL'}; static REMOVABLECASEMENT : any =  { type:3, value:'REMOVABLECASEMENT'}; static FIXEDCASEMENT : any =  { type:3, value:'FIXEDCASEMENT'}; static OTHEROPERATION : any =  { type:3, value:'OTHEROPERATION'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcWindowPanelPositionEnum {
	static LEFT : any =  { type:3, value:'LEFT'}; static MIDDLE : any =  { type:3, value:'MIDDLE'}; static RIGHT : any =  { type:3, value:'RIGHT'}; static BOTTOM : any =  { type:3, value:'BOTTOM'}; static TOP : any =  { type:3, value:'TOP'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcWindowStyleConstructionEnum {
	static ALUMINIUM : any =  { type:3, value:'ALUMINIUM'}; static HIGH_GRADE_STEEL : any =  { type:3, value:'HIGH_GRADE_STEEL'}; static STEEL : any =  { type:3, value:'STEEL'}; static WOOD : any =  { type:3, value:'WOOD'}; static ALUMINIUM_WOOD : any =  { type:3, value:'ALUMINIUM_WOOD'}; static PLASTIC : any =  { type:3, value:'PLASTIC'}; static OTHER_CONSTRUCTION : any =  { type:3, value:'OTHER_CONSTRUCTION'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcWindowStyleOperationEnum {
	static SINGLE_PANEL : any =  { type:3, value:'SINGLE_PANEL'}; static DOUBLE_PANEL_VERTICAL : any =  { type:3, value:'DOUBLE_PANEL_VERTICAL'}; static DOUBLE_PANEL_HORIZONTAL : any =  { type:3, value:'DOUBLE_PANEL_HORIZONTAL'}; static TRIPLE_PANEL_VERTICAL : any =  { type:3, value:'TRIPLE_PANEL_VERTICAL'}; static TRIPLE_PANEL_BOTTOM : any =  { type:3, value:'TRIPLE_PANEL_BOTTOM'}; static TRIPLE_PANEL_TOP : any =  { type:3, value:'TRIPLE_PANEL_TOP'}; static TRIPLE_PANEL_LEFT : any =  { type:3, value:'TRIPLE_PANEL_LEFT'}; static TRIPLE_PANEL_RIGHT : any =  { type:3, value:'TRIPLE_PANEL_RIGHT'}; static TRIPLE_PANEL_HORIZONTAL : any =  { type:3, value:'TRIPLE_PANEL_HORIZONTAL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcWorkControlTypeEnum {
	static ACTUAL : any =  { type:3, value:'ACTUAL'}; static BASELINE : any =  { type:3, value:'BASELINE'}; static PLANNED : any =  { type:3, value:'PLANNED'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export type IfcActorSelect =  | (Reference<IfcOrganization> | IfcOrganization) | (Reference<IfcPerson> | IfcPerson) | (Reference<IfcPersonAndOrganization> | IfcPersonAndOrganization);
export type IfcAppliedValueSelect =  | IfcRatioMeasure | (Reference<IfcMeasureWithUnit> | IfcMeasureWithUnit) | IfcMonetaryMeasure;
export type IfcAxis2Placement =  | (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) | (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D);
export type IfcBooleanOperand =  | (Reference<IfcSolidModel> | IfcSolidModel) | (Reference<IfcHalfSpaceSolid> | IfcHalfSpaceSolid) | (Reference<IfcBooleanResult> | IfcBooleanResult) | (Reference<IfcCsgPrimitive3D> | IfcCsgPrimitive3D);
export type IfcCharacterStyleSelect =  | (Reference<IfcTextStyleForDefinedFont> | IfcTextStyleForDefinedFont);
export type IfcClassificationNotationSelect =  | (Reference<IfcClassificationNotation> | IfcClassificationNotation) | (Reference<IfcClassificationReference> | IfcClassificationReference);
export type IfcColour =  | (Reference<IfcColourSpecification> | IfcColourSpecification) | (Reference<IfcPreDefinedColour> | IfcPreDefinedColour);
export type IfcColourOrFactor =  | (Reference<IfcColourRgb> | IfcColourRgb) | IfcNormalisedRatioMeasure;
export type IfcConditionCriterionSelect =  | IfcLabel | (Reference<IfcMeasureWithUnit> | IfcMeasureWithUnit);
export type IfcCsgSelect =  | (Reference<IfcBooleanResult> | IfcBooleanResult) | (Reference<IfcCsgPrimitive3D> | IfcCsgPrimitive3D);
export type IfcCurveFontOrScaledCurveFontSelect =  | IfcCurveStyleFontSelect | (Reference<IfcCurveStyleFontAndScaling> | IfcCurveStyleFontAndScaling);
export type IfcCurveOrEdgeCurve =  | (Reference<IfcBoundedCurve> | IfcBoundedCurve) | (Reference<IfcEdgeCurve> | IfcEdgeCurve);
export type IfcCurveStyleFontSelect =  | (Reference<IfcPreDefinedCurveFont> | IfcPreDefinedCurveFont) | (Reference<IfcCurveStyleFont> | IfcCurveStyleFont);
export type IfcDateTimeSelect =  | (Reference<IfcCalendarDate> | IfcCalendarDate) | (Reference<IfcLocalTime> | IfcLocalTime) | (Reference<IfcDateAndTime> | IfcDateAndTime);
export type IfcDefinedSymbolSelect =  | (Reference<IfcPreDefinedSymbol> | IfcPreDefinedSymbol) | (Reference<IfcExternallyDefinedSymbol> | IfcExternallyDefinedSymbol);
export type IfcDerivedMeasureValue =  | IfcVolumetricFlowRateMeasure | IfcTimeStamp | IfcThermalTransmittanceMeasure | IfcThermalResistanceMeasure | IfcThermalAdmittanceMeasure | IfcPressureMeasure | IfcPowerMeasure | IfcMassFlowRateMeasure | IfcMassDensityMeasure | IfcLinearVelocityMeasure | IfcKinematicViscosityMeasure | IfcIntegerCountRateMeasure | IfcHeatFluxDensityMeasure | IfcFrequencyMeasure | IfcEnergyMeasure | IfcElectricVoltageMeasure | IfcDynamicViscosityMeasure | IfcCompoundPlaneAngleMeasure | IfcAngularVelocityMeasure | IfcThermalConductivityMeasure | IfcMolecularWeightMeasure | IfcVaporPermeabilityMeasure | IfcMoistureDiffusivityMeasure | IfcIsothermalMoistureCapacityMeasure | IfcSpecificHeatCapacityMeasure | IfcMonetaryMeasure | IfcMagneticFluxDensityMeasure | IfcMagneticFluxMeasure | IfcLuminousFluxMeasure | IfcForceMeasure | IfcInductanceMeasure | IfcIlluminanceMeasure | IfcElectricResistanceMeasure | IfcElectricConductanceMeasure | IfcElectricChargeMeasure | IfcDoseEquivalentMeasure | IfcElectricCapacitanceMeasure | IfcAbsorbedDoseMeasure | IfcRadioActivityMeasure | IfcRotationalFrequencyMeasure | IfcTorqueMeasure | IfcAccelerationMeasure | IfcLinearForceMeasure | IfcLinearStiffnessMeasure | IfcModulusOfSubgradeReactionMeasure | IfcModulusOfElasticityMeasure | IfcMomentOfInertiaMeasure | IfcPlanarForceMeasure | IfcRotationalStiffnessMeasure | IfcShearModulusMeasure | IfcLinearMomentMeasure | IfcLuminousIntensityDistributionMeasure | IfcCurvatureMeasure | IfcMassPerLengthMeasure | IfcModulusOfLinearSubgradeReactionMeasure | IfcModulusOfRotationalSubgradeReactionMeasure | IfcRotationalMassMeasure | IfcSectionalAreaIntegralMeasure | IfcSectionModulusMeasure | IfcTemperatureGradientMeasure | IfcThermalExpansionCoefficientMeasure | IfcWarpingConstantMeasure | IfcWarpingMomentMeasure | IfcSoundPowerMeasure | IfcSoundPressureMeasure | IfcHeatingValueMeasure | IfcPHMeasure | IfcIonConcentrationMeasure;
export type IfcDocumentSelect =  | (Reference<IfcDocumentReference> | IfcDocumentReference) | (Reference<IfcDocumentInformation> | IfcDocumentInformation);
export type IfcDraughtingCalloutElement =  | (Reference<IfcAnnotationCurveOccurrence> | IfcAnnotationCurveOccurrence) | (Reference<IfcAnnotationTextOccurrence> | IfcAnnotationTextOccurrence) | (Reference<IfcAnnotationSymbolOccurrence> | IfcAnnotationSymbolOccurrence);
export type IfcFillAreaStyleTileShapeSelect =  | (Reference<IfcFillAreaStyleTileSymbolWithStyle> | IfcFillAreaStyleTileSymbolWithStyle);
export type IfcFillStyleSelect =  | (Reference<IfcFillAreaStyleHatching> | IfcFillAreaStyleHatching) | (Reference<IfcFillAreaStyleTiles> | IfcFillAreaStyleTiles) | IfcColour | (Reference<IfcExternallyDefinedHatchStyle> | IfcExternallyDefinedHatchStyle);
export type IfcGeometricSetSelect =  | (Reference<IfcPoint> | IfcPoint) | (Reference<IfcCurve> | IfcCurve) | (Reference<IfcSurface> | IfcSurface);
export type IfcHatchLineDistanceSelect =  | (Reference<IfcOneDirectionRepeatFactor> | IfcOneDirectionRepeatFactor) | IfcPositiveLengthMeasure;
export type IfcLayeredItem =  | (Reference<IfcRepresentationItem> | IfcRepresentationItem) | (Reference<IfcRepresentation> | IfcRepresentation);
export type IfcLibrarySelect =  | (Reference<IfcLibraryReference> | IfcLibraryReference) | (Reference<IfcLibraryInformation> | IfcLibraryInformation);
export type IfcLightDistributionDataSourceSelect =  | (Reference<IfcExternalReference> | IfcExternalReference) | (Reference<IfcLightIntensityDistribution> | IfcLightIntensityDistribution);
export type IfcMaterialSelect =  | (Reference<IfcMaterial> | IfcMaterial) | (Reference<IfcMaterialList> | IfcMaterialList) | (Reference<IfcMaterialLayerSetUsage> | IfcMaterialLayerSetUsage) | (Reference<IfcMaterialLayerSet> | IfcMaterialLayerSet) | (Reference<IfcMaterialLayer> | IfcMaterialLayer);
export type IfcMeasureValue =  | IfcVolumeMeasure | IfcTimeMeasure | IfcThermodynamicTemperatureMeasure | IfcSolidAngleMeasure | IfcPositiveRatioMeasure | IfcRatioMeasure | IfcPositivePlaneAngleMeasure | IfcPlaneAngleMeasure | IfcParameterValue | IfcNumericMeasure | IfcMassMeasure | IfcPositiveLengthMeasure | IfcLengthMeasure | IfcElectricCurrentMeasure | IfcDescriptiveMeasure | IfcCountMeasure | IfcContextDependentMeasure | IfcAreaMeasure | IfcAmountOfSubstanceMeasure | IfcLuminousIntensityMeasure | IfcNormalisedRatioMeasure | IfcComplexNumber;
export type IfcMetricValueSelect =  | IfcDateTimeSelect | (Reference<IfcMeasureWithUnit> | IfcMeasureWithUnit) | (Reference<IfcTable> | IfcTable) | IfcText | (Reference<IfcTimeSeries> | IfcTimeSeries) | (Reference<IfcCostValue> | IfcCostValue);
export type IfcObjectReferenceSelect =  | (Reference<IfcMaterial> | IfcMaterial) | (Reference<IfcPerson> | IfcPerson) | (Reference<IfcDateAndTime> | IfcDateAndTime) | (Reference<IfcMaterialList> | IfcMaterialList) | (Reference<IfcOrganization> | IfcOrganization) | (Reference<IfcCalendarDate> | IfcCalendarDate) | (Reference<IfcLocalTime> | IfcLocalTime) | (Reference<IfcPersonAndOrganization> | IfcPersonAndOrganization) | (Reference<IfcMaterialLayer> | IfcMaterialLayer) | (Reference<IfcExternalReference> | IfcExternalReference) | (Reference<IfcTimeSeries> | IfcTimeSeries) | (Reference<IfcAddress> | IfcAddress) | (Reference<IfcAppliedValue> | IfcAppliedValue);
export type IfcOrientationSelect =  | IfcPlaneAngleMeasure | (Reference<IfcDirection> | IfcDirection);
export type IfcPointOrVertexPoint =  | (Reference<IfcPoint> | IfcPoint) | (Reference<IfcVertexPoint> | IfcVertexPoint);
export type IfcPresentationStyleSelect =  | IfcNullStyle | (Reference<IfcCurveStyle> | IfcCurveStyle) | (Reference<IfcSymbolStyle> | IfcSymbolStyle) | (Reference<IfcFillAreaStyle> | IfcFillAreaStyle) | (Reference<IfcTextStyle> | IfcTextStyle) | (Reference<IfcSurfaceStyle> | IfcSurfaceStyle);
export type IfcShell =  | (Reference<IfcClosedShell> | IfcClosedShell) | (Reference<IfcOpenShell> | IfcOpenShell);
export type IfcSimpleValue =  | IfcInteger | IfcReal | IfcBoolean | IfcIdentifier | IfcText | IfcLabel | IfcLogical;
export type IfcSizeSelect =  | IfcRatioMeasure | IfcLengthMeasure | IfcDescriptiveMeasure | IfcPositiveLengthMeasure | IfcNormalisedRatioMeasure | IfcPositiveRatioMeasure;
export type IfcSpecularHighlightSelect =  | IfcSpecularExponent | IfcSpecularRoughness;
export type IfcStructuralActivityAssignmentSelect =  | (Reference<IfcStructuralItem> | IfcStructuralItem) | (Reference<IfcElement> | IfcElement);
export type IfcSurfaceOrFaceSurface =  | (Reference<IfcSurface> | IfcSurface) | (Reference<IfcFaceSurface> | IfcFaceSurface) | (Reference<IfcFaceBasedSurfaceModel> | IfcFaceBasedSurfaceModel);
export type IfcSurfaceStyleElementSelect =  | (Reference<IfcSurfaceStyleShading> | IfcSurfaceStyleShading) | (Reference<IfcSurfaceStyleLighting> | IfcSurfaceStyleLighting) | (Reference<IfcSurfaceStyleWithTextures> | IfcSurfaceStyleWithTextures) | (Reference<IfcExternallyDefinedSurfaceStyle> | IfcExternallyDefinedSurfaceStyle) | (Reference<IfcSurfaceStyleRefraction> | IfcSurfaceStyleRefraction);
export type IfcSymbolStyleSelect =  | IfcColour;
export type IfcTextFontSelect =  | (Reference<IfcPreDefinedTextFont> | IfcPreDefinedTextFont) | (Reference<IfcExternallyDefinedTextFont> | IfcExternallyDefinedTextFont);
export type IfcTextStyleSelect =  | (Reference<IfcTextStyleWithBoxCharacteristics> | IfcTextStyleWithBoxCharacteristics) | (Reference<IfcTextStyleTextModel> | IfcTextStyleTextModel);
export type IfcTrimmingSelect =  | (Reference<IfcCartesianPoint> | IfcCartesianPoint) | IfcParameterValue;
export type IfcUnit =  | (Reference<IfcDerivedUnit> | IfcDerivedUnit) | (Reference<IfcNamedUnit> | IfcNamedUnit) | (Reference<IfcMonetaryUnit> | IfcMonetaryUnit);
export type IfcValue =  | IfcMeasureValue | IfcSimpleValue | IfcDerivedMeasureValue;
export type IfcVectorOrDirection =  | (Reference<IfcDirection> | IfcDirection) | (Reference<IfcVector> | IfcVector);
export class IfcActorRole extends IfcLineObject {
	expressID:number=3630933823;
	constructor(expressID: number, public Role: IfcRoleEnum , public UserDefinedRole: IfcLabel | null, public Description: IfcText | null)
	{
		super(expressID);
	}
}
export class IfcAddress extends IfcLineObject {
	expressID:number=618182010;
	OfPerson!: (Reference<IfcPerson> | IfcPerson)[] | null;
	OfOrganization!: (Reference<IfcOrganization> | IfcOrganization)[] | null;
	constructor(expressID: number, public Purpose: IfcAddressTypeEnum | null, public Description: IfcText | null, public UserDefinedPurpose: IfcLabel | null)
	{
		super(expressID);
	}
}
export class IfcApplication extends IfcLineObject {
	expressID:number=639542469;
	constructor(expressID: number, public ApplicationDeveloper: (Reference<IfcOrganization> | IfcOrganization) , public Version: IfcLabel , public ApplicationFullName: IfcLabel , public ApplicationIdentifier: IfcIdentifier )
	{
		super(expressID);
	}
}
export class IfcAppliedValue extends IfcLineObject {
	expressID:number=411424972;
	ValuesReferenced!: (Reference<IfcReferencesValueDocument> | IfcReferencesValueDocument)[] | null;
	ValueOfComponents!: (Reference<IfcAppliedValueRelationship> | IfcAppliedValueRelationship)[] | null;
	IsComponentIn!: (Reference<IfcAppliedValueRelationship> | IfcAppliedValueRelationship)[] | null;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public AppliedValue: IfcAppliedValueSelect | null, public UnitBasis: (Reference<IfcMeasureWithUnit> | IfcMeasureWithUnit) | null, public ApplicableDate: IfcDateTimeSelect | null, public FixedUntilDate: IfcDateTimeSelect | null)
	{
		super(expressID);
	}
}
export class IfcAppliedValueRelationship extends IfcLineObject {
	expressID:number=1110488051;
	constructor(expressID: number, public ComponentOfTotal: (Reference<IfcAppliedValue> | IfcAppliedValue) , public Components: (Reference<IfcAppliedValue> | IfcAppliedValue)[] , public ArithmeticOperator: IfcArithmeticOperatorEnum , public Name: IfcLabel | null, public Description: IfcText | null)
	{
		super(expressID);
	}
}
export class IfcApproval extends IfcLineObject {
	expressID:number=130549933;
	Actors!: (Reference<IfcApprovalActorRelationship> | IfcApprovalActorRelationship)[] | null;
	IsRelatedWith!: (Reference<IfcApprovalRelationship> | IfcApprovalRelationship)[] | null;
	Relates!: (Reference<IfcApprovalRelationship> | IfcApprovalRelationship)[] | null;
	constructor(expressID: number, public Description: IfcText | null, public ApprovalDateTime: IfcDateTimeSelect , public ApprovalStatus: IfcLabel | null, public ApprovalLevel: IfcLabel | null, public ApprovalQualifier: IfcText | null, public Name: IfcLabel , public Identifier: IfcIdentifier )
	{
		super(expressID);
	}
}
export class IfcApprovalActorRelationship extends IfcLineObject {
	expressID:number=2080292479;
	constructor(expressID: number, public Actor: IfcActorSelect , public Approval: (Reference<IfcApproval> | IfcApproval) , public Role: (Reference<IfcActorRole> | IfcActorRole) )
	{
		super(expressID);
	}
}
export class IfcApprovalPropertyRelationship extends IfcLineObject {
	expressID:number=390851274;
	constructor(expressID: number, public ApprovedProperties: (Reference<IfcProperty> | IfcProperty)[] , public Approval: (Reference<IfcApproval> | IfcApproval) )
	{
		super(expressID);
	}
}
export class IfcApprovalRelationship extends IfcLineObject {
	expressID:number=3869604511;
	constructor(expressID: number, public RelatedApproval: (Reference<IfcApproval> | IfcApproval) , public RelatingApproval: (Reference<IfcApproval> | IfcApproval) , public Description: IfcText | null, public Name: IfcLabel )
	{
		super(expressID);
	}
}
export class IfcBoundaryCondition extends IfcLineObject {
	expressID:number=4037036970;
	constructor(expressID: number, public Name: IfcLabel | null)
	{
		super(expressID);
	}
}
export class IfcBoundaryEdgeCondition extends IfcBoundaryCondition {
	expressID:number=1560379544;
	constructor(expressID: number, public Name: IfcLabel | null, public LinearStiffnessByLengthX: IfcModulusOfLinearSubgradeReactionMeasure | null, public LinearStiffnessByLengthY: IfcModulusOfLinearSubgradeReactionMeasure | null, public LinearStiffnessByLengthZ: IfcModulusOfLinearSubgradeReactionMeasure | null, public RotationalStiffnessByLengthX: IfcModulusOfRotationalSubgradeReactionMeasure | null, public RotationalStiffnessByLengthY: IfcModulusOfRotationalSubgradeReactionMeasure | null, public RotationalStiffnessByLengthZ: IfcModulusOfRotationalSubgradeReactionMeasure | null)
	{
		super(expressID,Name);
	}
}
export class IfcBoundaryFaceCondition extends IfcBoundaryCondition {
	expressID:number=3367102660;
	constructor(expressID: number, public Name: IfcLabel | null, public LinearStiffnessByAreaX: IfcModulusOfSubgradeReactionMeasure | null, public LinearStiffnessByAreaY: IfcModulusOfSubgradeReactionMeasure | null, public LinearStiffnessByAreaZ: IfcModulusOfSubgradeReactionMeasure | null)
	{
		super(expressID,Name);
	}
}
export class IfcBoundaryNodeCondition extends IfcBoundaryCondition {
	expressID:number=1387855156;
	constructor(expressID: number, public Name: IfcLabel | null, public LinearStiffnessX: IfcLinearStiffnessMeasure | null, public LinearStiffnessY: IfcLinearStiffnessMeasure | null, public LinearStiffnessZ: IfcLinearStiffnessMeasure | null, public RotationalStiffnessX: IfcRotationalStiffnessMeasure | null, public RotationalStiffnessY: IfcRotationalStiffnessMeasure | null, public RotationalStiffnessZ: IfcRotationalStiffnessMeasure | null)
	{
		super(expressID,Name);
	}
}
export class IfcBoundaryNodeConditionWarping extends IfcBoundaryNodeCondition {
	expressID:number=2069777674;
	constructor(expressID: number, public Name: IfcLabel | null, public LinearStiffnessX: IfcLinearStiffnessMeasure | null, public LinearStiffnessY: IfcLinearStiffnessMeasure | null, public LinearStiffnessZ: IfcLinearStiffnessMeasure | null, public RotationalStiffnessX: IfcRotationalStiffnessMeasure | null, public RotationalStiffnessY: IfcRotationalStiffnessMeasure | null, public RotationalStiffnessZ: IfcRotationalStiffnessMeasure | null, public WarpingStiffness: IfcWarpingMomentMeasure | null)
	{
		super(expressID,Name, LinearStiffnessX, LinearStiffnessY, LinearStiffnessZ, RotationalStiffnessX, RotationalStiffnessY, RotationalStiffnessZ);
	}
}
export class IfcCalendarDate extends IfcLineObject {
	expressID:number=622194075;
	constructor(expressID: number, public DayComponent: IfcDayInMonthNumber , public MonthComponent: IfcMonthInYearNumber , public YearComponent: IfcYearNumber )
	{
		super(expressID);
	}
}
export class IfcClassification extends IfcLineObject {
	expressID:number=747523909;
	Contains!: (Reference<IfcClassificationItem> | IfcClassificationItem)[] | null;
	constructor(expressID: number, public Source: IfcLabel , public Edition: IfcLabel , public EditionDate: (Reference<IfcCalendarDate> | IfcCalendarDate) | null, public Name: IfcLabel )
	{
		super(expressID);
	}
}
export class IfcClassificationItem extends IfcLineObject {
	expressID:number=1767535486;
	IsClassifiedItemIn!: (Reference<IfcClassificationItemRelationship> | IfcClassificationItemRelationship)[] | null;
	IsClassifyingItemIn!: (Reference<IfcClassificationItemRelationship> | IfcClassificationItemRelationship)[] | null;
	constructor(expressID: number, public Notation: (Reference<IfcClassificationNotationFacet> | IfcClassificationNotationFacet) , public ItemOf: (Reference<IfcClassification> | IfcClassification) | null, public Title: IfcLabel )
	{
		super(expressID);
	}
}
export class IfcClassificationItemRelationship extends IfcLineObject {
	expressID:number=1098599126;
	constructor(expressID: number, public RelatingItem: (Reference<IfcClassificationItem> | IfcClassificationItem) , public RelatedItems: (Reference<IfcClassificationItem> | IfcClassificationItem)[] )
	{
		super(expressID);
	}
}
export class IfcClassificationNotation extends IfcLineObject {
	expressID:number=938368621;
	constructor(expressID: number, public NotationFacets: (Reference<IfcClassificationNotationFacet> | IfcClassificationNotationFacet)[] )
	{
		super(expressID);
	}
}
export class IfcClassificationNotationFacet extends IfcLineObject {
	expressID:number=3639012971;
	constructor(expressID: number, public NotationValue: IfcLabel )
	{
		super(expressID);
	}
}
export class IfcColourSpecification extends IfcLineObject {
	expressID:number=3264961684;
	constructor(expressID: number, public Name: IfcLabel | null)
	{
		super(expressID);
	}
}
export class IfcConnectionGeometry extends IfcLineObject {
	expressID:number=2859738748;
	constructor(expressID: number, )
	{
		super(expressID);
	}
}
export class IfcConnectionPointGeometry extends IfcConnectionGeometry {
	expressID:number=2614616156;
	constructor(expressID: number, public PointOnRelatingElement: IfcPointOrVertexPoint , public PointOnRelatedElement: IfcPointOrVertexPoint | null)
	{
			super(expressID);
	}
}
export class IfcConnectionPortGeometry extends IfcConnectionGeometry {
	expressID:number=4257277454;
	constructor(expressID: number, public LocationAtRelatingElement: IfcAxis2Placement , public LocationAtRelatedElement: IfcAxis2Placement | null, public ProfileOfPort: (Reference<IfcProfileDef> | IfcProfileDef) )
	{
			super(expressID);
	}
}
export class IfcConnectionSurfaceGeometry extends IfcConnectionGeometry {
	expressID:number=2732653382;
	constructor(expressID: number, public SurfaceOnRelatingElement: IfcSurfaceOrFaceSurface , public SurfaceOnRelatedElement: IfcSurfaceOrFaceSurface | null)
	{
			super(expressID);
	}
}
export class IfcConstraint extends IfcLineObject {
	expressID:number=1959218052;
	ClassifiedAs!: (Reference<IfcConstraintClassificationRelationship> | IfcConstraintClassificationRelationship)[] | null;
	RelatesConstraints!: (Reference<IfcConstraintRelationship> | IfcConstraintRelationship)[] | null;
	IsRelatedWith!: (Reference<IfcConstraintRelationship> | IfcConstraintRelationship)[] | null;
	PropertiesForConstraint!: (Reference<IfcPropertyConstraintRelationship> | IfcPropertyConstraintRelationship)[] | null;
	Aggregates!: (Reference<IfcConstraintAggregationRelationship> | IfcConstraintAggregationRelationship)[] | null;
	IsAggregatedIn!: (Reference<IfcConstraintAggregationRelationship> | IfcConstraintAggregationRelationship)[] | null;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public ConstraintGrade: IfcConstraintEnum , public ConstraintSource: IfcLabel | null, public CreatingActor: IfcActorSelect | null, public CreationTime: IfcDateTimeSelect | null, public UserDefinedGrade: IfcLabel | null)
	{
		super(expressID);
	}
}
export class IfcConstraintAggregationRelationship extends IfcLineObject {
	expressID:number=1658513725;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingConstraint: (Reference<IfcConstraint> | IfcConstraint) , public RelatedConstraints: (Reference<IfcConstraint> | IfcConstraint)[] , public LogicalAggregator: IfcLogicalOperatorEnum )
	{
		super(expressID);
	}
}
export class IfcConstraintClassificationRelationship extends IfcLineObject {
	expressID:number=613356794;
	constructor(expressID: number, public ClassifiedConstraint: (Reference<IfcConstraint> | IfcConstraint) , public RelatedClassifications: IfcClassificationNotationSelect[] )
	{
		super(expressID);
	}
}
export class IfcConstraintRelationship extends IfcLineObject {
	expressID:number=347226245;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingConstraint: (Reference<IfcConstraint> | IfcConstraint) , public RelatedConstraints: (Reference<IfcConstraint> | IfcConstraint)[] )
	{
		super(expressID);
	}
}
export class IfcCoordinatedUniversalTimeOffset extends IfcLineObject {
	expressID:number=1065062679;
	constructor(expressID: number, public HourOffset: IfcHourInDay , public MinuteOffset: IfcMinuteInHour | null, public Sense: IfcAheadOrBehind )
	{
		super(expressID);
	}
}
export class IfcCostValue extends IfcAppliedValue {
	expressID:number=602808272;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public AppliedValue: IfcAppliedValueSelect | null, public UnitBasis: (Reference<IfcMeasureWithUnit> | IfcMeasureWithUnit) | null, public ApplicableDate: IfcDateTimeSelect | null, public FixedUntilDate: IfcDateTimeSelect | null, public CostType: IfcLabel , public Condition: IfcText | null)
	{
		super(expressID,Name, Description, AppliedValue, UnitBasis, ApplicableDate, FixedUntilDate);
	}
}
export class IfcCurrencyRelationship extends IfcLineObject {
	expressID:number=539742890;
	constructor(expressID: number, public RelatingMonetaryUnit: (Reference<IfcMonetaryUnit> | IfcMonetaryUnit) , public RelatedMonetaryUnit: (Reference<IfcMonetaryUnit> | IfcMonetaryUnit) , public ExchangeRate: IfcPositiveRatioMeasure , public RateDateTime: (Reference<IfcDateAndTime> | IfcDateAndTime) , public RateSource: (Reference<IfcLibraryInformation> | IfcLibraryInformation) | null)
	{
		super(expressID);
	}
}
export class IfcCurveStyleFont extends IfcLineObject {
	expressID:number=1105321065;
	constructor(expressID: number, public Name: IfcLabel | null, public PatternList: (Reference<IfcCurveStyleFontPattern> | IfcCurveStyleFontPattern)[] )
	{
		super(expressID);
	}
}
export class IfcCurveStyleFontAndScaling extends IfcLineObject {
	expressID:number=2367409068;
	constructor(expressID: number, public Name: IfcLabel | null, public CurveFont: IfcCurveStyleFontSelect , public CurveFontScaling: IfcPositiveRatioMeasure )
	{
		super(expressID);
	}
}
export class IfcCurveStyleFontPattern extends IfcLineObject {
	expressID:number=3510044353;
	constructor(expressID: number, public VisibleSegmentLength: IfcLengthMeasure , public InvisibleSegmentLength: IfcPositiveLengthMeasure )
	{
		super(expressID);
	}
}
export class IfcDateAndTime extends IfcLineObject {
	expressID:number=1072939445;
	constructor(expressID: number, public DateComponent: (Reference<IfcCalendarDate> | IfcCalendarDate) , public TimeComponent: (Reference<IfcLocalTime> | IfcLocalTime) )
	{
		super(expressID);
	}
}
export class IfcDerivedUnit extends IfcLineObject {
	expressID:number=1765591967;
	constructor(expressID: number, public Elements: (Reference<IfcDerivedUnitElement> | IfcDerivedUnitElement)[] , public UnitType: IfcDerivedUnitEnum , public UserDefinedType: IfcLabel | null)
	{
		super(expressID);
	}
}
export class IfcDerivedUnitElement extends IfcLineObject {
	expressID:number=1045800335;
	constructor(expressID: number, public Unit: (Reference<IfcNamedUnit> | IfcNamedUnit) , public Exponent: number )
	{
		super(expressID);
	}
}
export class IfcDimensionalExponents extends IfcLineObject {
	expressID:number=2949456006;
	constructor(expressID: number, public LengthExponent: number , public MassExponent: number , public TimeExponent: number , public ElectricCurrentExponent: number , public ThermodynamicTemperatureExponent: number , public AmountOfSubstanceExponent: number , public LuminousIntensityExponent: number )
	{
		super(expressID);
	}
}
export class IfcDocumentElectronicFormat extends IfcLineObject {
	expressID:number=1376555844;
	constructor(expressID: number, public FileExtension: IfcLabel | null, public MimeContentType: IfcLabel | null, public MimeSubtype: IfcLabel | null)
	{
		super(expressID);
	}
}
export class IfcDocumentInformation extends IfcLineObject {
	expressID:number=1154170062;
	IsPointedTo!: (Reference<IfcDocumentInformationRelationship> | IfcDocumentInformationRelationship)[] | null;
	IsPointer!: (Reference<IfcDocumentInformationRelationship> | IfcDocumentInformationRelationship)[] | null;
	constructor(expressID: number, public DocumentId: IfcIdentifier , public Name: IfcLabel , public Description: IfcText | null, public DocumentReferences: (Reference<IfcDocumentReference> | IfcDocumentReference)[] | null, public Purpose: IfcText | null, public IntendedUse: IfcText | null, public Scope: IfcText | null, public Revision: IfcLabel | null, public DocumentOwner: IfcActorSelect | null, public Editors: IfcActorSelect[] | null, public CreationTime: (Reference<IfcDateAndTime> | IfcDateAndTime) | null, public LastRevisionTime: (Reference<IfcDateAndTime> | IfcDateAndTime) | null, public ElectronicFormat: (Reference<IfcDocumentElectronicFormat> | IfcDocumentElectronicFormat) | null, public ValidFrom: (Reference<IfcCalendarDate> | IfcCalendarDate) | null, public ValidUntil: (Reference<IfcCalendarDate> | IfcCalendarDate) | null, public Confidentiality: IfcDocumentConfidentialityEnum | null, public Status: IfcDocumentStatusEnum | null)
	{
		super(expressID);
	}
}
export class IfcDocumentInformationRelationship extends IfcLineObject {
	expressID:number=770865208;
	constructor(expressID: number, public RelatingDocument: (Reference<IfcDocumentInformation> | IfcDocumentInformation) , public RelatedDocuments: (Reference<IfcDocumentInformation> | IfcDocumentInformation)[] , public RelationshipType: IfcLabel | null)
	{
		super(expressID);
	}
}
export class IfcDraughtingCalloutRelationship extends IfcLineObject {
	expressID:number=3796139169;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingDraughtingCallout: (Reference<IfcDraughtingCallout> | IfcDraughtingCallout) , public RelatedDraughtingCallout: (Reference<IfcDraughtingCallout> | IfcDraughtingCallout) )
	{
		super(expressID);
	}
}
export class IfcEnvironmentalImpactValue extends IfcAppliedValue {
	expressID:number=1648886627;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public AppliedValue: IfcAppliedValueSelect | null, public UnitBasis: (Reference<IfcMeasureWithUnit> | IfcMeasureWithUnit) | null, public ApplicableDate: IfcDateTimeSelect | null, public FixedUntilDate: IfcDateTimeSelect | null, public ImpactType: IfcLabel , public Category: IfcEnvironmentalImpactCategoryEnum , public UserDefinedCategory: IfcLabel | null)
	{
		super(expressID,Name, Description, AppliedValue, UnitBasis, ApplicableDate, FixedUntilDate);
	}
}
export class IfcExternalReference extends IfcLineObject {
	expressID:number=3200245327;
	constructor(expressID: number, public Location: IfcLabel | null, public ItemReference: IfcIdentifier | null, public Name: IfcLabel | null)
	{
		super(expressID);
	}
}
export class IfcExternallyDefinedHatchStyle extends IfcExternalReference {
	expressID:number=2242383968;
	constructor(expressID: number, public Location: IfcLabel | null, public ItemReference: IfcIdentifier | null, public Name: IfcLabel | null)
	{
		super(expressID,Location, ItemReference, Name);
	}
}
export class IfcExternallyDefinedSurfaceStyle extends IfcExternalReference {
	expressID:number=1040185647;
	constructor(expressID: number, public Location: IfcLabel | null, public ItemReference: IfcIdentifier | null, public Name: IfcLabel | null)
	{
		super(expressID,Location, ItemReference, Name);
	}
}
export class IfcExternallyDefinedSymbol extends IfcExternalReference {
	expressID:number=3207319532;
	constructor(expressID: number, public Location: IfcLabel | null, public ItemReference: IfcIdentifier | null, public Name: IfcLabel | null)
	{
		super(expressID,Location, ItemReference, Name);
	}
}
export class IfcExternallyDefinedTextFont extends IfcExternalReference {
	expressID:number=3548104201;
	constructor(expressID: number, public Location: IfcLabel | null, public ItemReference: IfcIdentifier | null, public Name: IfcLabel | null)
	{
		super(expressID,Location, ItemReference, Name);
	}
}
export class IfcGridAxis extends IfcLineObject {
	expressID:number=852622518;
	PartOfW!: (Reference<IfcGrid> | IfcGrid)[] | null;
	PartOfV!: (Reference<IfcGrid> | IfcGrid)[] | null;
	PartOfU!: (Reference<IfcGrid> | IfcGrid)[] | null;
	HasIntersections!: (Reference<IfcVirtualGridIntersection> | IfcVirtualGridIntersection)[] | null;
	constructor(expressID: number, public AxisTag: IfcLabel | null, public AxisCurve: (Reference<IfcCurve> | IfcCurve) , public SameSense: IfcBoolean )
	{
		super(expressID);
	}
}
export class IfcIrregularTimeSeriesValue extends IfcLineObject {
	expressID:number=3020489413;
	constructor(expressID: number, public TimeStamp: IfcDateTimeSelect , public ListValues: IfcValue[] )
	{
		super(expressID);
	}
}
export class IfcLibraryInformation extends IfcLineObject {
	expressID:number=2655187982;
	constructor(expressID: number, public Name: IfcLabel , public Version: IfcLabel | null, public Publisher: (Reference<IfcOrganization> | IfcOrganization) | null, public VersionDate: (Reference<IfcCalendarDate> | IfcCalendarDate) | null, public LibraryReference: (Reference<IfcLibraryReference> | IfcLibraryReference)[] | null)
	{
		super(expressID);
	}
}
export class IfcLibraryReference extends IfcExternalReference {
	expressID:number=3452421091;
	ReferenceIntoLibrary!: (Reference<IfcLibraryInformation> | IfcLibraryInformation)[] | null;
	constructor(expressID: number, public Location: IfcLabel | null, public ItemReference: IfcIdentifier | null, public Name: IfcLabel | null)
	{
		super(expressID,Location, ItemReference, Name);
	}
}
export class IfcLightDistributionData extends IfcLineObject {
	expressID:number=4162380809;
	constructor(expressID: number, public MainPlaneAngle: IfcPlaneAngleMeasure , public SecondaryPlaneAngle: IfcPlaneAngleMeasure[] , public LuminousIntensity: IfcLuminousIntensityDistributionMeasure[] )
	{
		super(expressID);
	}
}
export class IfcLightIntensityDistribution extends IfcLineObject {
	expressID:number=1566485204;
	constructor(expressID: number, public LightDistributionCurve: IfcLightDistributionCurveEnum , public DistributionData: (Reference<IfcLightDistributionData> | IfcLightDistributionData)[] )
	{
		super(expressID);
	}
}
export class IfcLocalTime extends IfcLineObject {
	expressID:number=30780891;
	constructor(expressID: number, public HourComponent: IfcHourInDay , public MinuteComponent: IfcMinuteInHour | null, public SecondComponent: IfcSecondInMinute | null, public Zone: (Reference<IfcCoordinatedUniversalTimeOffset> | IfcCoordinatedUniversalTimeOffset) | null, public DaylightSavingOffset: IfcDaylightSavingHour | null)
	{
		super(expressID);
	}
}
export class IfcMaterial extends IfcLineObject {
	expressID:number=1838606355;
	HasRepresentation!: (Reference<IfcMaterialDefinitionRepresentation> | IfcMaterialDefinitionRepresentation)[] | null;
	ClassifiedAs!: (Reference<IfcMaterialClassificationRelationship> | IfcMaterialClassificationRelationship)[] | null;
	constructor(expressID: number, public Name: IfcLabel )
	{
		super(expressID);
	}
}
export class IfcMaterialClassificationRelationship extends IfcLineObject {
	expressID:number=1847130766;
	constructor(expressID: number, public MaterialClassifications: IfcClassificationNotationSelect[] , public ClassifiedMaterial: (Reference<IfcMaterial> | IfcMaterial) )
	{
		super(expressID);
	}
}
export class IfcMaterialLayer extends IfcLineObject {
	expressID:number=248100487;
	ToMaterialLayerSet!: (Reference<IfcMaterialLayerSet> | IfcMaterialLayerSet) | null;
	constructor(expressID: number, public Material: (Reference<IfcMaterial> | IfcMaterial) | null, public LayerThickness: IfcPositiveLengthMeasure , public IsVentilated: IfcLogical | null)
	{
		super(expressID);
	}
}
export class IfcMaterialLayerSet extends IfcLineObject {
	expressID:number=3303938423;
	constructor(expressID: number, public MaterialLayers: (Reference<IfcMaterialLayer> | IfcMaterialLayer)[] , public LayerSetName: IfcLabel | null)
	{
		super(expressID);
	}
}
export class IfcMaterialLayerSetUsage extends IfcLineObject {
	expressID:number=1303795690;
	constructor(expressID: number, public ForLayerSet: (Reference<IfcMaterialLayerSet> | IfcMaterialLayerSet) , public LayerSetDirection: IfcLayerSetDirectionEnum , public DirectionSense: IfcDirectionSenseEnum , public OffsetFromReferenceLine: IfcLengthMeasure )
	{
		super(expressID);
	}
}
export class IfcMaterialList extends IfcLineObject {
	expressID:number=2199411900;
	constructor(expressID: number, public Materials: (Reference<IfcMaterial> | IfcMaterial)[] )
	{
		super(expressID);
	}
}
export class IfcMaterialProperties extends IfcLineObject {
	expressID:number=3265635763;
	constructor(expressID: number, public Material: (Reference<IfcMaterial> | IfcMaterial) )
	{
		super(expressID);
	}
}
export class IfcMeasureWithUnit extends IfcLineObject {
	expressID:number=2597039031;
	constructor(expressID: number, public ValueComponent: IfcValue , public UnitComponent: IfcUnit )
	{
		super(expressID);
	}
}
export class IfcMechanicalMaterialProperties extends IfcMaterialProperties {
	expressID:number=4256014907;
	constructor(expressID: number, public Material: (Reference<IfcMaterial> | IfcMaterial) , public DynamicViscosity: IfcDynamicViscosityMeasure | null, public YoungModulus: IfcModulusOfElasticityMeasure | null, public ShearModulus: IfcModulusOfElasticityMeasure | null, public PoissonRatio: IfcPositiveRatioMeasure | null, public ThermalExpansionCoefficient: IfcThermalExpansionCoefficientMeasure | null)
	{
		super(expressID,Material);
	}
}
export class IfcMechanicalSteelMaterialProperties extends IfcMechanicalMaterialProperties {
	expressID:number=677618848;
	constructor(expressID: number, public Material: (Reference<IfcMaterial> | IfcMaterial) , public DynamicViscosity: IfcDynamicViscosityMeasure | null, public YoungModulus: IfcModulusOfElasticityMeasure | null, public ShearModulus: IfcModulusOfElasticityMeasure | null, public PoissonRatio: IfcPositiveRatioMeasure | null, public ThermalExpansionCoefficient: IfcThermalExpansionCoefficientMeasure | null, public YieldStress: IfcPressureMeasure | null, public UltimateStress: IfcPressureMeasure | null, public UltimateStrain: IfcPositiveRatioMeasure | null, public HardeningModule: IfcModulusOfElasticityMeasure | null, public ProportionalStress: IfcPressureMeasure | null, public PlasticStrain: IfcPositiveRatioMeasure | null, public Relaxations: (Reference<IfcRelaxation> | IfcRelaxation)[] | null)
	{
		super(expressID,Material, DynamicViscosity, YoungModulus, ShearModulus, PoissonRatio, ThermalExpansionCoefficient);
	}
}
export class IfcMetric extends IfcConstraint {
	expressID:number=3368373690;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public ConstraintGrade: IfcConstraintEnum , public ConstraintSource: IfcLabel | null, public CreatingActor: IfcActorSelect | null, public CreationTime: IfcDateTimeSelect | null, public UserDefinedGrade: IfcLabel | null, public Benchmark: IfcBenchmarkEnum , public ValueSource: IfcLabel | null, public DataValue: IfcMetricValueSelect )
	{
		super(expressID,Name, Description, ConstraintGrade, ConstraintSource, CreatingActor, CreationTime, UserDefinedGrade);
	}
}
export class IfcMonetaryUnit extends IfcLineObject {
	expressID:number=2706619895;
	constructor(expressID: number, public Currency: IfcCurrencyEnum )
	{
		super(expressID);
	}
}
export class IfcNamedUnit extends IfcLineObject {
	expressID:number=1918398963;
	constructor(expressID: number, public Dimensions: (Reference<IfcDimensionalExponents> | IfcDimensionalExponents) , public UnitType: IfcUnitEnum )
	{
		super(expressID);
	}
}
export class IfcObjectPlacement extends IfcLineObject {
	expressID:number=3701648758;
	PlacesObject!: (Reference<IfcProduct> | IfcProduct)[] | null;
	ReferencedByPlacements!: (Reference<IfcLocalPlacement> | IfcLocalPlacement)[] | null;
	constructor(expressID: number, )
	{
		super(expressID);
	}
}
export class IfcObjective extends IfcConstraint {
	expressID:number=2251480897;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public ConstraintGrade: IfcConstraintEnum , public ConstraintSource: IfcLabel | null, public CreatingActor: IfcActorSelect | null, public CreationTime: IfcDateTimeSelect | null, public UserDefinedGrade: IfcLabel | null, public BenchmarkValues: (Reference<IfcMetric> | IfcMetric) | null, public ResultValues: (Reference<IfcMetric> | IfcMetric) | null, public ObjectiveQualifier: IfcObjectiveEnum , public UserDefinedQualifier: IfcLabel | null)
	{
		super(expressID,Name, Description, ConstraintGrade, ConstraintSource, CreatingActor, CreationTime, UserDefinedGrade);
	}
}
export class IfcOpticalMaterialProperties extends IfcMaterialProperties {
	expressID:number=1227763645;
	constructor(expressID: number, public Material: (Reference<IfcMaterial> | IfcMaterial) , public VisibleTransmittance: IfcPositiveRatioMeasure | null, public SolarTransmittance: IfcPositiveRatioMeasure | null, public ThermalIrTransmittance: IfcPositiveRatioMeasure | null, public ThermalIrEmissivityBack: IfcPositiveRatioMeasure | null, public ThermalIrEmissivityFront: IfcPositiveRatioMeasure | null, public VisibleReflectanceBack: IfcPositiveRatioMeasure | null, public VisibleReflectanceFront: IfcPositiveRatioMeasure | null, public SolarReflectanceFront: IfcPositiveRatioMeasure | null, public SolarReflectanceBack: IfcPositiveRatioMeasure | null)
	{
		super(expressID,Material);
	}
}
export class IfcOrganization extends IfcLineObject {
	expressID:number=4251960020;
	IsRelatedBy!: (Reference<IfcOrganizationRelationship> | IfcOrganizationRelationship)[] | null;
	Relates!: (Reference<IfcOrganizationRelationship> | IfcOrganizationRelationship)[] | null;
	Engages!: (Reference<IfcPersonAndOrganization> | IfcPersonAndOrganization)[] | null;
	constructor(expressID: number, public Id: IfcIdentifier | null, public Name: IfcLabel , public Description: IfcText | null, public Roles: (Reference<IfcActorRole> | IfcActorRole)[] | null, public Addresses: (Reference<IfcAddress> | IfcAddress)[] | null)
	{
		super(expressID);
	}
}
export class IfcOrganizationRelationship extends IfcLineObject {
	expressID:number=1411181986;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public RelatingOrganization: (Reference<IfcOrganization> | IfcOrganization) , public RelatedOrganizations: (Reference<IfcOrganization> | IfcOrganization)[] )
	{
		super(expressID);
	}
}
export class IfcOwnerHistory extends IfcLineObject {
	expressID:number=1207048766;
	constructor(expressID: number, public OwningUser: (Reference<IfcPersonAndOrganization> | IfcPersonAndOrganization) , public OwningApplication: (Reference<IfcApplication> | IfcApplication) , public State: IfcStateEnum | null, public ChangeAction: IfcChangeActionEnum , public LastModifiedDate: IfcTimeStamp | null, public LastModifyingUser: (Reference<IfcPersonAndOrganization> | IfcPersonAndOrganization) | null, public LastModifyingApplication: (Reference<IfcApplication> | IfcApplication) | null, public CreationDate: IfcTimeStamp )
	{
		super(expressID);
	}
}
export class IfcPerson extends IfcLineObject {
	expressID:number=2077209135;
	EngagedIn!: (Reference<IfcPersonAndOrganization> | IfcPersonAndOrganization)[] | null;
	constructor(expressID: number, public Id: IfcIdentifier | null, public FamilyName: IfcLabel | null, public GivenName: IfcLabel | null, public MiddleNames: IfcLabel[] | null, public PrefixTitles: IfcLabel[] | null, public SuffixTitles: IfcLabel[] | null, public Roles: (Reference<IfcActorRole> | IfcActorRole)[] | null, public Addresses: (Reference<IfcAddress> | IfcAddress)[] | null)
	{
		super(expressID);
	}
}
export class IfcPersonAndOrganization extends IfcLineObject {
	expressID:number=101040310;
	constructor(expressID: number, public ThePerson: (Reference<IfcPerson> | IfcPerson) , public TheOrganization: (Reference<IfcOrganization> | IfcOrganization) , public Roles: (Reference<IfcActorRole> | IfcActorRole)[] | null)
	{
		super(expressID);
	}
}
export class IfcPhysicalQuantity extends IfcLineObject {
	expressID:number=2483315170;
	PartOfComplex!: (Reference<IfcPhysicalComplexQuantity> | IfcPhysicalComplexQuantity)[] | null;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null)
	{
		super(expressID);
	}
}
export class IfcPhysicalSimpleQuantity extends IfcPhysicalQuantity {
	expressID:number=2226359599;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public Unit: (Reference<IfcNamedUnit> | IfcNamedUnit) | null)
	{
		super(expressID,Name, Description);
	}
}
export class IfcPostalAddress extends IfcAddress {
	expressID:number=3355820592;
	constructor(expressID: number, public Purpose: IfcAddressTypeEnum | null, public Description: IfcText | null, public UserDefinedPurpose: IfcLabel | null, public InternalLocation: IfcLabel | null, public AddressLines: IfcLabel[] | null, public PostalBox: IfcLabel | null, public Town: IfcLabel | null, public Region: IfcLabel | null, public PostalCode: IfcLabel | null, public Country: IfcLabel | null)
	{
		super(expressID,Purpose, Description, UserDefinedPurpose);
	}
}
export class IfcPreDefinedItem extends IfcLineObject {
	expressID:number=3727388367;
	constructor(expressID: number, public Name: IfcLabel )
	{
		super(expressID);
	}
}
export class IfcPreDefinedSymbol extends IfcPreDefinedItem {
	expressID:number=990879717;
	constructor(expressID: number, public Name: IfcLabel )
	{
		super(expressID,Name);
	}
}
export class IfcPreDefinedTerminatorSymbol extends IfcPreDefinedSymbol {
	expressID:number=3213052703;
	constructor(expressID: number, public Name: IfcLabel )
	{
		super(expressID,Name);
	}
}
export class IfcPreDefinedTextFont extends IfcPreDefinedItem {
	expressID:number=1775413392;
	constructor(expressID: number, public Name: IfcLabel )
	{
		super(expressID,Name);
	}
}
export class IfcPresentationLayerAssignment extends IfcLineObject {
	expressID:number=2022622350;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public AssignedItems: IfcLayeredItem[] , public Identifier: IfcIdentifier | null)
	{
		super(expressID);
	}
}
export class IfcPresentationLayerWithStyle extends IfcPresentationLayerAssignment {
	expressID:number=1304840413;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public AssignedItems: IfcLayeredItem[] , public Identifier: IfcIdentifier | null, public LayerOn: boolean , public LayerFrozen: boolean , public LayerBlocked: boolean , public LayerStyles: IfcPresentationStyleSelect[] )
	{
		super(expressID,Name, Description, AssignedItems, Identifier);
	}
}
export class IfcPresentationStyle extends IfcLineObject {
	expressID:number=3119450353;
	constructor(expressID: number, public Name: IfcLabel | null)
	{
		super(expressID);
	}
}
export class IfcPresentationStyleAssignment extends IfcLineObject {
	expressID:number=2417041796;
	constructor(expressID: number, public Styles: IfcPresentationStyleSelect[] )
	{
		super(expressID);
	}
}
export class IfcProductRepresentation extends IfcLineObject {
	expressID:number=2095639259;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public Representations: (Reference<IfcRepresentation> | IfcRepresentation)[] )
	{
		super(expressID);
	}
}
export class IfcProductsOfCombustionProperties extends IfcMaterialProperties {
	expressID:number=2267347899;
	constructor(expressID: number, public Material: (Reference<IfcMaterial> | IfcMaterial) , public SpecificHeatCapacity: IfcSpecificHeatCapacityMeasure | null, public N20Content: IfcPositiveRatioMeasure | null, public COContent: IfcPositiveRatioMeasure | null, public CO2Content: IfcPositiveRatioMeasure | null)
	{
		super(expressID,Material);
	}
}
export class IfcProfileDef extends IfcLineObject {
	expressID:number=3958567839;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null)
	{
		super(expressID);
	}
}
export class IfcProfileProperties extends IfcLineObject {
	expressID:number=2802850158;
	constructor(expressID: number, public ProfileName: IfcLabel | null, public ProfileDefinition: (Reference<IfcProfileDef> | IfcProfileDef) | null)
	{
		super(expressID);
	}
}
export class IfcProperty extends IfcLineObject {
	expressID:number=2598011224;
	PropertyForDependance!: (Reference<IfcPropertyDependencyRelationship> | IfcPropertyDependencyRelationship)[] | null;
	PropertyDependsOn!: (Reference<IfcPropertyDependencyRelationship> | IfcPropertyDependencyRelationship)[] | null;
	PartOfComplex!: (Reference<IfcComplexProperty> | IfcComplexProperty)[] | null;
	constructor(expressID: number, public Name: IfcIdentifier , public Description: IfcText | null)
	{
		super(expressID);
	}
}
export class IfcPropertyConstraintRelationship extends IfcLineObject {
	expressID:number=3896028662;
	constructor(expressID: number, public RelatingConstraint: (Reference<IfcConstraint> | IfcConstraint) , public RelatedProperties: (Reference<IfcProperty> | IfcProperty)[] , public Name: IfcLabel | null, public Description: IfcText | null)
	{
		super(expressID);
	}
}
export class IfcPropertyDependencyRelationship extends IfcLineObject {
	expressID:number=148025276;
	constructor(expressID: number, public DependingProperty: (Reference<IfcProperty> | IfcProperty) , public DependantProperty: (Reference<IfcProperty> | IfcProperty) , public Name: IfcLabel | null, public Description: IfcText | null, public Expression: IfcText | null)
	{
		super(expressID);
	}
}
export class IfcPropertyEnumeration extends IfcLineObject {
	expressID:number=3710013099;
	constructor(expressID: number, public Name: IfcLabel , public EnumerationValues: IfcValue[] , public Unit: IfcUnit | null)
	{
		super(expressID);
	}
}
export class IfcQuantityArea extends IfcPhysicalSimpleQuantity {
	expressID:number=2044713172;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public Unit: (Reference<IfcNamedUnit> | IfcNamedUnit) | null, public AreaValue: IfcAreaMeasure )
	{
		super(expressID,Name, Description, Unit);
	}
}
export class IfcQuantityCount extends IfcPhysicalSimpleQuantity {
	expressID:number=2093928680;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public Unit: (Reference<IfcNamedUnit> | IfcNamedUnit) | null, public CountValue: IfcCountMeasure )
	{
		super(expressID,Name, Description, Unit);
	}
}
export class IfcQuantityLength extends IfcPhysicalSimpleQuantity {
	expressID:number=931644368;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public Unit: (Reference<IfcNamedUnit> | IfcNamedUnit) | null, public LengthValue: IfcLengthMeasure )
	{
		super(expressID,Name, Description, Unit);
	}
}
export class IfcQuantityTime extends IfcPhysicalSimpleQuantity {
	expressID:number=3252649465;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public Unit: (Reference<IfcNamedUnit> | IfcNamedUnit) | null, public TimeValue: IfcTimeMeasure )
	{
		super(expressID,Name, Description, Unit);
	}
}
export class IfcQuantityVolume extends IfcPhysicalSimpleQuantity {
	expressID:number=2405470396;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public Unit: (Reference<IfcNamedUnit> | IfcNamedUnit) | null, public VolumeValue: IfcVolumeMeasure )
	{
		super(expressID,Name, Description, Unit);
	}
}
export class IfcQuantityWeight extends IfcPhysicalSimpleQuantity {
	expressID:number=825690147;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public Unit: (Reference<IfcNamedUnit> | IfcNamedUnit) | null, public WeightValue: IfcMassMeasure )
	{
		super(expressID,Name, Description, Unit);
	}
}
export class IfcReferencesValueDocument extends IfcLineObject {
	expressID:number=2692823254;
	constructor(expressID: number, public ReferencedDocument: IfcDocumentSelect , public ReferencingValues: (Reference<IfcAppliedValue> | IfcAppliedValue)[] , public Name: IfcLabel | null, public Description: IfcText | null)
	{
		super(expressID);
	}
}
export class IfcReinforcementBarProperties extends IfcLineObject {
	expressID:number=1580146022;
	constructor(expressID: number, public TotalCrossSectionArea: IfcAreaMeasure , public SteelGrade: IfcLabel , public BarSurface: IfcReinforcingBarSurfaceEnum | null, public EffectiveDepth: IfcLengthMeasure | null, public NominalBarDiameter: IfcPositiveLengthMeasure | null, public BarCount: IfcCountMeasure | null)
	{
		super(expressID);
	}
}
export class IfcRelaxation extends IfcLineObject {
	expressID:number=1222501353;
	constructor(expressID: number, public RelaxationValue: IfcNormalisedRatioMeasure , public InitialStress: IfcNormalisedRatioMeasure )
	{
		super(expressID);
	}
}
export class IfcRepresentation extends IfcLineObject {
	expressID:number=1076942058;
	RepresentationMap!: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null;
	LayerAssignments!: (Reference<IfcPresentationLayerAssignment> | IfcPresentationLayerAssignment)[] | null;
	OfProductRepresentation!: (Reference<IfcProductRepresentation> | IfcProductRepresentation)[] | null;
	constructor(expressID: number, public ContextOfItems: (Reference<IfcRepresentationContext> | IfcRepresentationContext) , public RepresentationIdentifier: IfcLabel | null, public RepresentationType: IfcLabel | null, public Items: (Reference<IfcRepresentationItem> | IfcRepresentationItem)[] )
	{
		super(expressID);
	}
}
export class IfcRepresentationContext extends IfcLineObject {
	expressID:number=3377609919;
	RepresentationsInContext!: (Reference<IfcRepresentation> | IfcRepresentation)[] | null;
	constructor(expressID: number, public ContextIdentifier: IfcLabel | null, public ContextType: IfcLabel | null)
	{
		super(expressID);
	}
}
export class IfcRepresentationItem extends IfcLineObject {
	expressID:number=3008791417;
	LayerAssignments!: (Reference<IfcPresentationLayerAssignment> | IfcPresentationLayerAssignment)[] | null;
	StyledByItem!: (Reference<IfcStyledItem> | IfcStyledItem)[] | null;
	constructor(expressID: number, )
	{
		super(expressID);
	}
}
export class IfcRepresentationMap extends IfcLineObject {
	expressID:number=1660063152;
	MapUsage!: (Reference<IfcMappedItem> | IfcMappedItem)[] | null;
	constructor(expressID: number, public MappingOrigin: IfcAxis2Placement , public MappedRepresentation: (Reference<IfcRepresentation> | IfcRepresentation) )
	{
		super(expressID);
	}
}
export class IfcRibPlateProfileProperties extends IfcProfileProperties {
	expressID:number=3679540991;
	constructor(expressID: number, public ProfileName: IfcLabel | null, public ProfileDefinition: (Reference<IfcProfileDef> | IfcProfileDef) | null, public Thickness: IfcPositiveLengthMeasure | null, public RibHeight: IfcPositiveLengthMeasure | null, public RibWidth: IfcPositiveLengthMeasure | null, public RibSpacing: IfcPositiveLengthMeasure | null, public Direction: IfcRibPlateDirectionEnum )
	{
		super(expressID,ProfileName, ProfileDefinition);
	}
}
export class IfcRoot extends IfcLineObject {
	expressID:number=2341007311;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null)
	{
		super(expressID);
	}
}
export class IfcSIUnit extends IfcNamedUnit {
	expressID:number=448429030;
	constructor(expressID: number, public UnitType: IfcUnitEnum , public Prefix: IfcSIPrefix | null, public Name: IfcSIUnitName )
	{
		super(expressID,new Reference(0), UnitType);
	}
}
export class IfcSectionProperties extends IfcLineObject {
	expressID:number=2042790032;
	constructor(expressID: number, public SectionType: IfcSectionTypeEnum , public StartProfile: (Reference<IfcProfileDef> | IfcProfileDef) , public EndProfile: (Reference<IfcProfileDef> | IfcProfileDef) | null)
	{
		super(expressID);
	}
}
export class IfcSectionReinforcementProperties extends IfcLineObject {
	expressID:number=4165799628;
	constructor(expressID: number, public LongitudinalStartPosition: IfcLengthMeasure , public LongitudinalEndPosition: IfcLengthMeasure , public TransversePosition: IfcLengthMeasure | null, public ReinforcementRole: IfcReinforcingBarRoleEnum , public SectionDefinition: (Reference<IfcSectionProperties> | IfcSectionProperties) , public CrossSectionReinforcementDefinitions: (Reference<IfcReinforcementBarProperties> | IfcReinforcementBarProperties)[] )
	{
		super(expressID);
	}
}
export class IfcShapeAspect extends IfcLineObject {
	expressID:number=867548509;
	constructor(expressID: number, public ShapeRepresentations: (Reference<IfcShapeModel> | IfcShapeModel)[] , public Name: IfcLabel | null, public Description: IfcText | null, public ProductDefinitional: boolean , public PartOfProductDefinitionShape: (Reference<IfcProductDefinitionShape> | IfcProductDefinitionShape) )
	{
		super(expressID);
	}
}
export class IfcShapeModel extends IfcRepresentation {
	expressID:number=3982875396;
	OfShapeAspect!: (Reference<IfcShapeAspect> | IfcShapeAspect)[] | null;
	constructor(expressID: number, public ContextOfItems: (Reference<IfcRepresentationContext> | IfcRepresentationContext) , public RepresentationIdentifier: IfcLabel | null, public RepresentationType: IfcLabel | null, public Items: (Reference<IfcRepresentationItem> | IfcRepresentationItem)[] )
	{
		super(expressID,ContextOfItems, RepresentationIdentifier, RepresentationType, Items);
	}
}
export class IfcShapeRepresentation extends IfcShapeModel {
	expressID:number=4240577450;
	constructor(expressID: number, public ContextOfItems: (Reference<IfcRepresentationContext> | IfcRepresentationContext) , public RepresentationIdentifier: IfcLabel | null, public RepresentationType: IfcLabel | null, public Items: (Reference<IfcRepresentationItem> | IfcRepresentationItem)[] )
	{
		super(expressID,ContextOfItems, RepresentationIdentifier, RepresentationType, Items);
	}
}
export class IfcSimpleProperty extends IfcProperty {
	expressID:number=3692461612;
	constructor(expressID: number, public Name: IfcIdentifier , public Description: IfcText | null)
	{
		super(expressID,Name, Description);
	}
}
export class IfcStructuralConnectionCondition extends IfcLineObject {
	expressID:number=2273995522;
	constructor(expressID: number, public Name: IfcLabel | null)
	{
		super(expressID);
	}
}
export class IfcStructuralLoad extends IfcLineObject {
	expressID:number=2162789131;
	constructor(expressID: number, public Name: IfcLabel | null)
	{
		super(expressID);
	}
}
export class IfcStructuralLoadStatic extends IfcStructuralLoad {
	expressID:number=2525727697;
	constructor(expressID: number, public Name: IfcLabel | null)
	{
		super(expressID,Name);
	}
}
export class IfcStructuralLoadTemperature extends IfcStructuralLoadStatic {
	expressID:number=3408363356;
	constructor(expressID: number, public Name: IfcLabel | null, public DeltaT_Constant: IfcThermodynamicTemperatureMeasure | null, public DeltaT_Y: IfcThermodynamicTemperatureMeasure | null, public DeltaT_Z: IfcThermodynamicTemperatureMeasure | null)
	{
		super(expressID,Name);
	}
}
export class IfcStyleModel extends IfcRepresentation {
	expressID:number=2830218821;
	constructor(expressID: number, public ContextOfItems: (Reference<IfcRepresentationContext> | IfcRepresentationContext) , public RepresentationIdentifier: IfcLabel | null, public RepresentationType: IfcLabel | null, public Items: (Reference<IfcRepresentationItem> | IfcRepresentationItem)[] )
	{
		super(expressID,ContextOfItems, RepresentationIdentifier, RepresentationType, Items);
	}
}
export class IfcStyledItem extends IfcRepresentationItem {
	expressID:number=3958052878;
	constructor(expressID: number, public Item: (Reference<IfcRepresentationItem> | IfcRepresentationItem) | null, public Styles: (Reference<IfcPresentationStyleAssignment> | IfcPresentationStyleAssignment)[] , public Name: IfcLabel | null)
	{
			super(expressID);
	}
}
export class IfcStyledRepresentation extends IfcStyleModel {
	expressID:number=3049322572;
	constructor(expressID: number, public ContextOfItems: (Reference<IfcRepresentationContext> | IfcRepresentationContext) , public RepresentationIdentifier: IfcLabel | null, public RepresentationType: IfcLabel | null, public Items: (Reference<IfcRepresentationItem> | IfcRepresentationItem)[] )
	{
		super(expressID,ContextOfItems, RepresentationIdentifier, RepresentationType, Items);
	}
}
export class IfcSurfaceStyle extends IfcPresentationStyle {
	expressID:number=1300840506;
	constructor(expressID: number, public Name: IfcLabel | null, public Side: IfcSurfaceSide , public Styles: IfcSurfaceStyleElementSelect[] )
	{
		super(expressID,Name);
	}
}
export class IfcSurfaceStyleLighting extends IfcLineObject {
	expressID:number=3303107099;
	constructor(expressID: number, public DiffuseTransmissionColour: (Reference<IfcColourRgb> | IfcColourRgb) , public DiffuseReflectionColour: (Reference<IfcColourRgb> | IfcColourRgb) , public TransmissionColour: (Reference<IfcColourRgb> | IfcColourRgb) , public ReflectanceColour: (Reference<IfcColourRgb> | IfcColourRgb) )
	{
		super(expressID);
	}
}
export class IfcSurfaceStyleRefraction extends IfcLineObject {
	expressID:number=1607154358;
	constructor(expressID: number, public RefractionIndex: IfcReal | null, public DispersionFactor: IfcReal | null)
	{
		super(expressID);
	}
}
export class IfcSurfaceStyleShading extends IfcLineObject {
	expressID:number=846575682;
	constructor(expressID: number, public SurfaceColour: (Reference<IfcColourRgb> | IfcColourRgb) )
	{
		super(expressID);
	}
}
export class IfcSurfaceStyleWithTextures extends IfcLineObject {
	expressID:number=1351298697;
	constructor(expressID: number, public Textures: (Reference<IfcSurfaceTexture> | IfcSurfaceTexture)[] )
	{
		super(expressID);
	}
}
export class IfcSurfaceTexture extends IfcLineObject {
	expressID:number=626085974;
	constructor(expressID: number, public RepeatS: boolean , public RepeatT: boolean , public TextureType: IfcSurfaceTextureEnum , public TextureTransform: (Reference<IfcCartesianTransformationOperator2D> | IfcCartesianTransformationOperator2D) | null)
	{
		super(expressID);
	}
}
export class IfcSymbolStyle extends IfcPresentationStyle {
	expressID:number=1290481447;
	constructor(expressID: number, public Name: IfcLabel | null, public StyleOfSymbol: IfcSymbolStyleSelect )
	{
		super(expressID,Name);
	}
}
export class IfcTable extends IfcLineObject {
	expressID:number=985171141;
	constructor(expressID: number, public Name: string , public Rows: (Reference<IfcTableRow> | IfcTableRow)[] )
	{
		super(expressID);
	}
}
export class IfcTableRow extends IfcLineObject {
	expressID:number=531007025;
	OfTable!: (Reference<IfcTable> | IfcTable) | null;
	constructor(expressID: number, public RowCells: IfcValue[] , public IsHeading: boolean )
	{
		super(expressID);
	}
}
export class IfcTelecomAddress extends IfcAddress {
	expressID:number=912023232;
	constructor(expressID: number, public Purpose: IfcAddressTypeEnum | null, public Description: IfcText | null, public UserDefinedPurpose: IfcLabel | null, public TelephoneNumbers: IfcLabel[] | null, public FacsimileNumbers: IfcLabel[] | null, public PagerNumber: IfcLabel | null, public ElectronicMailAddresses: IfcLabel[] | null, public WWWHomePageURL: IfcLabel | null)
	{
		super(expressID,Purpose, Description, UserDefinedPurpose);
	}
}
export class IfcTextStyle extends IfcPresentationStyle {
	expressID:number=1447204868;
	constructor(expressID: number, public Name: IfcLabel | null, public TextCharacterAppearance: IfcCharacterStyleSelect | null, public TextStyle: IfcTextStyleSelect | null, public TextFontStyle: IfcTextFontSelect )
	{
		super(expressID,Name);
	}
}
export class IfcTextStyleFontModel extends IfcPreDefinedTextFont {
	expressID:number=1983826977;
	constructor(expressID: number, public Name: IfcLabel , public FontFamily: IfcTextFontName[] | null, public FontStyle: IfcFontStyle | null, public FontVariant: IfcFontVariant | null, public FontWeight: IfcFontWeight | null, public FontSize: IfcSizeSelect )
	{
		super(expressID,Name);
	}
}
export class IfcTextStyleForDefinedFont extends IfcLineObject {
	expressID:number=2636378356;
	constructor(expressID: number, public Colour: IfcColour , public BackgroundColour: IfcColour | null)
	{
		super(expressID);
	}
}
export class IfcTextStyleTextModel extends IfcLineObject {
	expressID:number=1640371178;
	constructor(expressID: number, public TextIndent: IfcSizeSelect | null, public TextAlign: IfcTextAlignment | null, public TextDecoration: IfcTextDecoration | null, public LetterSpacing: IfcSizeSelect | null, public WordSpacing: IfcSizeSelect | null, public TextTransform: IfcTextTransformation | null, public LineHeight: IfcSizeSelect | null)
	{
		super(expressID);
	}
}
export class IfcTextStyleWithBoxCharacteristics extends IfcLineObject {
	expressID:number=1484833681;
	constructor(expressID: number, public BoxHeight: IfcPositiveLengthMeasure | null, public BoxWidth: IfcPositiveLengthMeasure | null, public BoxSlantAngle: IfcPlaneAngleMeasure | null, public BoxRotateAngle: IfcPlaneAngleMeasure | null, public CharacterSpacing: IfcSizeSelect | null)
	{
		super(expressID);
	}
}
export class IfcTextureCoordinate extends IfcLineObject {
	expressID:number=280115917;
	AnnotatedSurface!: (Reference<IfcAnnotationSurface> | IfcAnnotationSurface)[] | null;
	constructor(expressID: number, )
	{
		super(expressID);
	}
}
export class IfcTextureCoordinateGenerator extends IfcTextureCoordinate {
	expressID:number=1742049831;
	constructor(expressID: number, public Mode: IfcLabel , public Parameter: IfcSimpleValue[] )
	{
			super(expressID);
	}
}
export class IfcTextureMap extends IfcTextureCoordinate {
	expressID:number=2552916305;
	constructor(expressID: number, public TextureMaps: (Reference<IfcVertexBasedTextureMap> | IfcVertexBasedTextureMap)[] )
	{
			super(expressID);
	}
}
export class IfcTextureVertex extends IfcLineObject {
	expressID:number=1210645708;
	constructor(expressID: number, public Coordinates: IfcParameterValue[] )
	{
		super(expressID);
	}
}
export class IfcThermalMaterialProperties extends IfcMaterialProperties {
	expressID:number=3317419933;
	constructor(expressID: number, public Material: (Reference<IfcMaterial> | IfcMaterial) , public SpecificHeatCapacity: IfcSpecificHeatCapacityMeasure | null, public BoilingPoint: IfcThermodynamicTemperatureMeasure | null, public FreezingPoint: IfcThermodynamicTemperatureMeasure | null, public ThermalConductivity: IfcThermalConductivityMeasure | null)
	{
		super(expressID,Material);
	}
}
export class IfcTimeSeries extends IfcLineObject {
	expressID:number=3101149627;
	DocumentedBy!: (Reference<IfcTimeSeriesReferenceRelationship> | IfcTimeSeriesReferenceRelationship)[] | null;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public StartTime: IfcDateTimeSelect , public EndTime: IfcDateTimeSelect , public TimeSeriesDataType: IfcTimeSeriesDataTypeEnum , public DataOrigin: IfcDataOriginEnum , public UserDefinedDataOrigin: IfcLabel | null, public Unit: IfcUnit | null)
	{
		super(expressID);
	}
}
export class IfcTimeSeriesReferenceRelationship extends IfcLineObject {
	expressID:number=1718945513;
	constructor(expressID: number, public ReferencedTimeSeries: (Reference<IfcTimeSeries> | IfcTimeSeries) , public TimeSeriesReferences: IfcDocumentSelect[] )
	{
		super(expressID);
	}
}
export class IfcTimeSeriesValue extends IfcLineObject {
	expressID:number=581633288;
	constructor(expressID: number, public ListValues: IfcValue[] )
	{
		super(expressID);
	}
}
export class IfcTopologicalRepresentationItem extends IfcRepresentationItem {
	expressID:number=1377556343;
	constructor(expressID: number, )
	{
			super(expressID);
	}
}
export class IfcTopologyRepresentation extends IfcShapeModel {
	expressID:number=1735638870;
	constructor(expressID: number, public ContextOfItems: (Reference<IfcRepresentationContext> | IfcRepresentationContext) , public RepresentationIdentifier: IfcLabel | null, public RepresentationType: IfcLabel | null, public Items: (Reference<IfcRepresentationItem> | IfcRepresentationItem)[] )
	{
		super(expressID,ContextOfItems, RepresentationIdentifier, RepresentationType, Items);
	}
}
export class IfcUnitAssignment extends IfcLineObject {
	expressID:number=180925521;
	constructor(expressID: number, public Units: IfcUnit[] )
	{
		super(expressID);
	}
}
export class IfcVertex extends IfcTopologicalRepresentationItem {
	expressID:number=2799835756;
	constructor(expressID: number, )
	{
			super(expressID);
	}
}
export class IfcVertexBasedTextureMap extends IfcLineObject {
	expressID:number=3304826586;
	constructor(expressID: number, public TextureVertices: (Reference<IfcTextureVertex> | IfcTextureVertex)[] , public TexturePoints: (Reference<IfcCartesianPoint> | IfcCartesianPoint)[] )
	{
		super(expressID);
	}
}
export class IfcVertexPoint extends IfcVertex {
	expressID:number=1907098498;
	constructor(expressID: number, public VertexGeometry: (Reference<IfcPoint> | IfcPoint) )
	{
			super(expressID);
	}
}
export class IfcVirtualGridIntersection extends IfcLineObject {
	expressID:number=891718957;
	constructor(expressID: number, public IntersectingAxes: (Reference<IfcGridAxis> | IfcGridAxis)[] , public OffsetDistances: IfcLengthMeasure[] )
	{
		super(expressID);
	}
}
export class IfcWaterProperties extends IfcMaterialProperties {
	expressID:number=1065908215;
	constructor(expressID: number, public Material: (Reference<IfcMaterial> | IfcMaterial) , public IsPotable: boolean | null, public Hardness: IfcIonConcentrationMeasure | null, public AlkalinityConcentration: IfcIonConcentrationMeasure | null, public AcidityConcentration: IfcIonConcentrationMeasure | null, public ImpuritiesContent: IfcNormalisedRatioMeasure | null, public PHLevel: IfcPHMeasure | null, public DissolvedSolidsContent: IfcNormalisedRatioMeasure | null)
	{
		super(expressID,Material);
	}
}
export class IfcAnnotationOccurrence extends IfcStyledItem {
	expressID:number=2442683028;
	constructor(expressID: number, public Item: (Reference<IfcRepresentationItem> | IfcRepresentationItem) | null, public Styles: (Reference<IfcPresentationStyleAssignment> | IfcPresentationStyleAssignment)[] , public Name: IfcLabel | null)
	{
		super(expressID,Item, Styles, Name);
	}
}
export class IfcAnnotationSurfaceOccurrence extends IfcAnnotationOccurrence {
	expressID:number=962685235;
	constructor(expressID: number, public Item: (Reference<IfcRepresentationItem> | IfcRepresentationItem) | null, public Styles: (Reference<IfcPresentationStyleAssignment> | IfcPresentationStyleAssignment)[] , public Name: IfcLabel | null)
	{
		super(expressID,Item, Styles, Name);
	}
}
export class IfcAnnotationSymbolOccurrence extends IfcAnnotationOccurrence {
	expressID:number=3612888222;
	constructor(expressID: number, public Item: (Reference<IfcRepresentationItem> | IfcRepresentationItem) | null, public Styles: (Reference<IfcPresentationStyleAssignment> | IfcPresentationStyleAssignment)[] , public Name: IfcLabel | null)
	{
		super(expressID,Item, Styles, Name);
	}
}
export class IfcAnnotationTextOccurrence extends IfcAnnotationOccurrence {
	expressID:number=2297822566;
	constructor(expressID: number, public Item: (Reference<IfcRepresentationItem> | IfcRepresentationItem) | null, public Styles: (Reference<IfcPresentationStyleAssignment> | IfcPresentationStyleAssignment)[] , public Name: IfcLabel | null)
	{
		super(expressID,Item, Styles, Name);
	}
}
export class IfcArbitraryClosedProfileDef extends IfcProfileDef {
	expressID:number=3798115385;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public OuterCurve: (Reference<IfcCurve> | IfcCurve) )
	{
		super(expressID,ProfileType, ProfileName);
	}
}
export class IfcArbitraryOpenProfileDef extends IfcProfileDef {
	expressID:number=1310608509;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Curve: (Reference<IfcBoundedCurve> | IfcBoundedCurve) )
	{
		super(expressID,ProfileType, ProfileName);
	}
}
export class IfcArbitraryProfileDefWithVoids extends IfcArbitraryClosedProfileDef {
	expressID:number=2705031697;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public OuterCurve: (Reference<IfcCurve> | IfcCurve) , public InnerCurves: (Reference<IfcCurve> | IfcCurve)[] )
	{
		super(expressID,ProfileType, ProfileName, OuterCurve);
	}
}
export class IfcBlobTexture extends IfcSurfaceTexture {
	expressID:number=616511568;
	constructor(expressID: number, public RepeatS: boolean , public RepeatT: boolean , public TextureType: IfcSurfaceTextureEnum , public TextureTransform: (Reference<IfcCartesianTransformationOperator2D> | IfcCartesianTransformationOperator2D) | null, public RasterFormat: IfcIdentifier , public RasterCode: boolean )
	{
		super(expressID,RepeatS, RepeatT, TextureType, TextureTransform);
	}
}
export class IfcCenterLineProfileDef extends IfcArbitraryOpenProfileDef {
	expressID:number=3150382593;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Curve: (Reference<IfcBoundedCurve> | IfcBoundedCurve) , public Thickness: IfcPositiveLengthMeasure )
	{
		super(expressID,ProfileType, ProfileName, Curve);
	}
}
export class IfcClassificationReference extends IfcExternalReference {
	expressID:number=647927063;
	constructor(expressID: number, public Location: IfcLabel | null, public ItemReference: IfcIdentifier | null, public Name: IfcLabel | null, public ReferencedSource: (Reference<IfcClassification> | IfcClassification) | null)
	{
		super(expressID,Location, ItemReference, Name);
	}
}
export class IfcColourRgb extends IfcColourSpecification {
	expressID:number=776857604;
	constructor(expressID: number, public Name: IfcLabel | null, public Red: IfcNormalisedRatioMeasure , public Green: IfcNormalisedRatioMeasure , public Blue: IfcNormalisedRatioMeasure )
	{
		super(expressID,Name);
	}
}
export class IfcComplexProperty extends IfcProperty {
	expressID:number=2542286263;
	constructor(expressID: number, public Name: IfcIdentifier , public Description: IfcText | null, public UsageName: IfcIdentifier , public HasProperties: (Reference<IfcProperty> | IfcProperty)[] )
	{
		super(expressID,Name, Description);
	}
}
export class IfcCompositeProfileDef extends IfcProfileDef {
	expressID:number=1485152156;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Profiles: (Reference<IfcProfileDef> | IfcProfileDef)[] , public Label: IfcLabel | null)
	{
		super(expressID,ProfileType, ProfileName);
	}
}
export class IfcConnectedFaceSet extends IfcTopologicalRepresentationItem {
	expressID:number=370225590;
	constructor(expressID: number, public CfsFaces: (Reference<IfcFace> | IfcFace)[] )
	{
			super(expressID);
	}
}
export class IfcConnectionCurveGeometry extends IfcConnectionGeometry {
	expressID:number=1981873012;
	constructor(expressID: number, public CurveOnRelatingElement: IfcCurveOrEdgeCurve , public CurveOnRelatedElement: IfcCurveOrEdgeCurve | null)
	{
			super(expressID);
	}
}
export class IfcConnectionPointEccentricity extends IfcConnectionPointGeometry {
	expressID:number=45288368;
	constructor(expressID: number, public PointOnRelatingElement: IfcPointOrVertexPoint , public PointOnRelatedElement: IfcPointOrVertexPoint | null, public EccentricityInX: IfcLengthMeasure | null, public EccentricityInY: IfcLengthMeasure | null, public EccentricityInZ: IfcLengthMeasure | null)
	{
		super(expressID,PointOnRelatingElement, PointOnRelatedElement);
	}
}
export class IfcContextDependentUnit extends IfcNamedUnit {
	expressID:number=3050246964;
	constructor(expressID: number, public Dimensions: (Reference<IfcDimensionalExponents> | IfcDimensionalExponents) , public UnitType: IfcUnitEnum , public Name: IfcLabel )
	{
		super(expressID,Dimensions, UnitType);
	}
}
export class IfcConversionBasedUnit extends IfcNamedUnit {
	expressID:number=2889183280;
	constructor(expressID: number, public Dimensions: (Reference<IfcDimensionalExponents> | IfcDimensionalExponents) , public UnitType: IfcUnitEnum , public Name: IfcLabel , public ConversionFactor: (Reference<IfcMeasureWithUnit> | IfcMeasureWithUnit) )
	{
		super(expressID,Dimensions, UnitType);
	}
}
export class IfcCurveStyle extends IfcPresentationStyle {
	expressID:number=3800577675;
	constructor(expressID: number, public Name: IfcLabel | null, public CurveFont: IfcCurveFontOrScaledCurveFontSelect | null, public CurveWidth: IfcSizeSelect | null, public CurveColour: IfcColour | null)
	{
		super(expressID,Name);
	}
}
export class IfcDerivedProfileDef extends IfcProfileDef {
	expressID:number=3632507154;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public ParentProfile: (Reference<IfcProfileDef> | IfcProfileDef) , public Operator: (Reference<IfcCartesianTransformationOperator2D> | IfcCartesianTransformationOperator2D) , public Label: IfcLabel | null)
	{
		super(expressID,ProfileType, ProfileName);
	}
}
export class IfcDimensionCalloutRelationship extends IfcDraughtingCalloutRelationship {
	expressID:number=2273265877;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingDraughtingCallout: (Reference<IfcDraughtingCallout> | IfcDraughtingCallout) , public RelatedDraughtingCallout: (Reference<IfcDraughtingCallout> | IfcDraughtingCallout) )
	{
		super(expressID,Name, Description, RelatingDraughtingCallout, RelatedDraughtingCallout);
	}
}
export class IfcDimensionPair extends IfcDraughtingCalloutRelationship {
	expressID:number=1694125774;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingDraughtingCallout: (Reference<IfcDraughtingCallout> | IfcDraughtingCallout) , public RelatedDraughtingCallout: (Reference<IfcDraughtingCallout> | IfcDraughtingCallout) )
	{
		super(expressID,Name, Description, RelatingDraughtingCallout, RelatedDraughtingCallout);
	}
}
export class IfcDocumentReference extends IfcExternalReference {
	expressID:number=3732053477;
	ReferenceToDocument!: (Reference<IfcDocumentInformation> | IfcDocumentInformation)[] | null;
	constructor(expressID: number, public Location: IfcLabel | null, public ItemReference: IfcIdentifier | null, public Name: IfcLabel | null)
	{
		super(expressID,Location, ItemReference, Name);
	}
}
export class IfcDraughtingPreDefinedTextFont extends IfcPreDefinedTextFont {
	expressID:number=4170525392;
	constructor(expressID: number, public Name: IfcLabel )
	{
		super(expressID,Name);
	}
}
export class IfcEdge extends IfcTopologicalRepresentationItem {
	expressID:number=3900360178;
	constructor(expressID: number, public EdgeStart: (Reference<IfcVertex> | IfcVertex) , public EdgeEnd: (Reference<IfcVertex> | IfcVertex) )
	{
			super(expressID);
	}
}
export class IfcEdgeCurve extends IfcEdge {
	expressID:number=476780140;
	constructor(expressID: number, public EdgeStart: (Reference<IfcVertex> | IfcVertex) , public EdgeEnd: (Reference<IfcVertex> | IfcVertex) , public EdgeGeometry: (Reference<IfcCurve> | IfcCurve) , public SameSense: boolean )
	{
		super(expressID,EdgeStart, EdgeEnd);
	}
}
export class IfcExtendedMaterialProperties extends IfcMaterialProperties {
	expressID:number=1860660968;
	constructor(expressID: number, public Material: (Reference<IfcMaterial> | IfcMaterial) , public ExtendedProperties: (Reference<IfcProperty> | IfcProperty)[] , public Description: IfcText | null, public Name: IfcLabel )
	{
		super(expressID,Material);
	}
}
export class IfcFace extends IfcTopologicalRepresentationItem {
	expressID:number=2556980723;
	constructor(expressID: number, public Bounds: (Reference<IfcFaceBound> | IfcFaceBound)[] )
	{
			super(expressID);
	}
}
export class IfcFaceBound extends IfcTopologicalRepresentationItem {
	expressID:number=1809719519;
	constructor(expressID: number, public Bound: (Reference<IfcLoop> | IfcLoop) , public Orientation: boolean )
	{
			super(expressID);
	}
}
export class IfcFaceOuterBound extends IfcFaceBound {
	expressID:number=803316827;
	constructor(expressID: number, public Bound: (Reference<IfcLoop> | IfcLoop) , public Orientation: boolean )
	{
		super(expressID,Bound, Orientation);
	}
}
export class IfcFaceSurface extends IfcFace {
	expressID:number=3008276851;
	constructor(expressID: number, public Bounds: (Reference<IfcFaceBound> | IfcFaceBound)[] , public FaceSurface: (Reference<IfcSurface> | IfcSurface) , public SameSense: boolean )
	{
		super(expressID,Bounds);
	}
}
export class IfcFailureConnectionCondition extends IfcStructuralConnectionCondition {
	expressID:number=4219587988;
	constructor(expressID: number, public Name: IfcLabel | null, public TensionFailureX: IfcForceMeasure | null, public TensionFailureY: IfcForceMeasure | null, public TensionFailureZ: IfcForceMeasure | null, public CompressionFailureX: IfcForceMeasure | null, public CompressionFailureY: IfcForceMeasure | null, public CompressionFailureZ: IfcForceMeasure | null)
	{
		super(expressID,Name);
	}
}
export class IfcFillAreaStyle extends IfcPresentationStyle {
	expressID:number=738692330;
	constructor(expressID: number, public Name: IfcLabel | null, public FillStyles: IfcFillStyleSelect[] )
	{
		super(expressID,Name);
	}
}
export class IfcFuelProperties extends IfcMaterialProperties {
	expressID:number=3857492461;
	constructor(expressID: number, public Material: (Reference<IfcMaterial> | IfcMaterial) , public CombustionTemperature: IfcThermodynamicTemperatureMeasure | null, public CarbonContent: IfcPositiveRatioMeasure | null, public LowerHeatingValue: IfcHeatingValueMeasure | null, public HigherHeatingValue: IfcHeatingValueMeasure | null)
	{
		super(expressID,Material);
	}
}
export class IfcGeneralMaterialProperties extends IfcMaterialProperties {
	expressID:number=803998398;
	constructor(expressID: number, public Material: (Reference<IfcMaterial> | IfcMaterial) , public MolecularWeight: IfcMolecularWeightMeasure | null, public Porosity: IfcNormalisedRatioMeasure | null, public MassDensity: IfcMassDensityMeasure | null)
	{
		super(expressID,Material);
	}
}
export class IfcGeneralProfileProperties extends IfcProfileProperties {
	expressID:number=1446786286;
	constructor(expressID: number, public ProfileName: IfcLabel | null, public ProfileDefinition: (Reference<IfcProfileDef> | IfcProfileDef) | null, public PhysicalWeight: IfcMassPerLengthMeasure | null, public Perimeter: IfcPositiveLengthMeasure | null, public MinimumPlateThickness: IfcPositiveLengthMeasure | null, public MaximumPlateThickness: IfcPositiveLengthMeasure | null, public CrossSectionArea: IfcAreaMeasure | null)
	{
		super(expressID,ProfileName, ProfileDefinition);
	}
}
export class IfcGeometricRepresentationContext extends IfcRepresentationContext {
	expressID:number=3448662350;
	HasSubContexts!: (Reference<IfcGeometricRepresentationSubContext> | IfcGeometricRepresentationSubContext)[] | null;
	constructor(expressID: number, public ContextIdentifier: IfcLabel | null, public ContextType: IfcLabel | null, public CoordinateSpaceDimension: IfcDimensionCount , public Precision: number | null, public WorldCoordinateSystem: IfcAxis2Placement , public TrueNorth: (Reference<IfcDirection> | IfcDirection) | null)
	{
		super(expressID,ContextIdentifier, ContextType);
	}
}
export class IfcGeometricRepresentationItem extends IfcRepresentationItem {
	expressID:number=2453401579;
	constructor(expressID: number, )
	{
			super(expressID);
	}
}
export class IfcGeometricRepresentationSubContext extends IfcGeometricRepresentationContext {
	expressID:number=4142052618;
	constructor(expressID: number, public ContextIdentifier: IfcLabel | null, public ContextType: IfcLabel | null, public ParentContext: (Reference<IfcGeometricRepresentationContext> | IfcGeometricRepresentationContext) , public TargetScale: IfcPositiveRatioMeasure | null, public TargetView: IfcGeometricProjectionEnum , public UserDefinedTargetView: IfcLabel | null)
	{
		super(expressID,ContextIdentifier, ContextType, new IfcDimensionCount(0), null, new Reference(0), null);
	}
}
export class IfcGeometricSet extends IfcGeometricRepresentationItem {
	expressID:number=3590301190;
	constructor(expressID: number, public Elements: IfcGeometricSetSelect[] )
	{
			super(expressID);
	}
}
export class IfcGridPlacement extends IfcObjectPlacement {
	expressID:number=178086475;
	constructor(expressID: number, public PlacementLocation: (Reference<IfcVirtualGridIntersection> | IfcVirtualGridIntersection) , public PlacementRefDirection: (Reference<IfcVirtualGridIntersection> | IfcVirtualGridIntersection) | null)
	{
			super(expressID);
	}
}
export class IfcHalfSpaceSolid extends IfcGeometricRepresentationItem {
	expressID:number=812098782;
	constructor(expressID: number, public BaseSurface: (Reference<IfcSurface> | IfcSurface) , public AgreementFlag: boolean )
	{
			super(expressID);
	}
}
export class IfcHygroscopicMaterialProperties extends IfcMaterialProperties {
	expressID:number=2445078500;
	constructor(expressID: number, public Material: (Reference<IfcMaterial> | IfcMaterial) , public UpperVaporResistanceFactor: IfcPositiveRatioMeasure | null, public LowerVaporResistanceFactor: IfcPositiveRatioMeasure | null, public IsothermalMoistureCapacity: IfcIsothermalMoistureCapacityMeasure | null, public VaporPermeability: IfcVaporPermeabilityMeasure | null, public MoistureDiffusivity: IfcMoistureDiffusivityMeasure | null)
	{
		super(expressID,Material);
	}
}
export class IfcImageTexture extends IfcSurfaceTexture {
	expressID:number=3905492369;
	constructor(expressID: number, public RepeatS: boolean , public RepeatT: boolean , public TextureType: IfcSurfaceTextureEnum , public TextureTransform: (Reference<IfcCartesianTransformationOperator2D> | IfcCartesianTransformationOperator2D) | null, public UrlReference: IfcIdentifier )
	{
		super(expressID,RepeatS, RepeatT, TextureType, TextureTransform);
	}
}
export class IfcIrregularTimeSeries extends IfcTimeSeries {
	expressID:number=3741457305;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public StartTime: IfcDateTimeSelect , public EndTime: IfcDateTimeSelect , public TimeSeriesDataType: IfcTimeSeriesDataTypeEnum , public DataOrigin: IfcDataOriginEnum , public UserDefinedDataOrigin: IfcLabel | null, public Unit: IfcUnit | null, public Values: (Reference<IfcIrregularTimeSeriesValue> | IfcIrregularTimeSeriesValue)[] )
	{
		super(expressID,Name, Description, StartTime, EndTime, TimeSeriesDataType, DataOrigin, UserDefinedDataOrigin, Unit);
	}
}
export class IfcLightSource extends IfcGeometricRepresentationItem {
	expressID:number=1402838566;
	constructor(expressID: number, public Name: IfcLabel | null, public LightColour: (Reference<IfcColourRgb> | IfcColourRgb) , public AmbientIntensity: IfcNormalisedRatioMeasure | null, public Intensity: IfcNormalisedRatioMeasure | null)
	{
			super(expressID);
	}
}
export class IfcLightSourceAmbient extends IfcLightSource {
	expressID:number=125510826;
	constructor(expressID: number, public Name: IfcLabel | null, public LightColour: (Reference<IfcColourRgb> | IfcColourRgb) , public AmbientIntensity: IfcNormalisedRatioMeasure | null, public Intensity: IfcNormalisedRatioMeasure | null)
	{
		super(expressID,Name, LightColour, AmbientIntensity, Intensity);
	}
}
export class IfcLightSourceDirectional extends IfcLightSource {
	expressID:number=2604431987;
	constructor(expressID: number, public Name: IfcLabel | null, public LightColour: (Reference<IfcColourRgb> | IfcColourRgb) , public AmbientIntensity: IfcNormalisedRatioMeasure | null, public Intensity: IfcNormalisedRatioMeasure | null, public Orientation: (Reference<IfcDirection> | IfcDirection) )
	{
		super(expressID,Name, LightColour, AmbientIntensity, Intensity);
	}
}
export class IfcLightSourceGoniometric extends IfcLightSource {
	expressID:number=4266656042;
	constructor(expressID: number, public Name: IfcLabel | null, public LightColour: (Reference<IfcColourRgb> | IfcColourRgb) , public AmbientIntensity: IfcNormalisedRatioMeasure | null, public Intensity: IfcNormalisedRatioMeasure | null, public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) , public ColourAppearance: (Reference<IfcColourRgb> | IfcColourRgb) | null, public ColourTemperature: IfcThermodynamicTemperatureMeasure , public LuminousFlux: IfcLuminousFluxMeasure , public LightEmissionSource: IfcLightEmissionSourceEnum , public LightDistributionDataSource: IfcLightDistributionDataSourceSelect )
	{
		super(expressID,Name, LightColour, AmbientIntensity, Intensity);
	}
}
export class IfcLightSourcePositional extends IfcLightSource {
	expressID:number=1520743889;
	constructor(expressID: number, public Name: IfcLabel | null, public LightColour: (Reference<IfcColourRgb> | IfcColourRgb) , public AmbientIntensity: IfcNormalisedRatioMeasure | null, public Intensity: IfcNormalisedRatioMeasure | null, public Position: (Reference<IfcCartesianPoint> | IfcCartesianPoint) , public Radius: IfcPositiveLengthMeasure , public ConstantAttenuation: IfcReal , public DistanceAttenuation: IfcReal , public QuadricAttenuation: IfcReal )
	{
		super(expressID,Name, LightColour, AmbientIntensity, Intensity);
	}
}
export class IfcLightSourceSpot extends IfcLightSourcePositional {
	expressID:number=3422422726;
	constructor(expressID: number, public Name: IfcLabel | null, public LightColour: (Reference<IfcColourRgb> | IfcColourRgb) , public AmbientIntensity: IfcNormalisedRatioMeasure | null, public Intensity: IfcNormalisedRatioMeasure | null, public Position: (Reference<IfcCartesianPoint> | IfcCartesianPoint) , public Radius: IfcPositiveLengthMeasure , public ConstantAttenuation: IfcReal , public DistanceAttenuation: IfcReal , public QuadricAttenuation: IfcReal , public Orientation: (Reference<IfcDirection> | IfcDirection) , public ConcentrationExponent: IfcReal | null, public SpreadAngle: IfcPositivePlaneAngleMeasure , public BeamWidthAngle: IfcPositivePlaneAngleMeasure )
	{
		super(expressID,Name, LightColour, AmbientIntensity, Intensity, Position, Radius, ConstantAttenuation, DistanceAttenuation, QuadricAttenuation);
	}
}
export class IfcLocalPlacement extends IfcObjectPlacement {
	expressID:number=2624227202;
	constructor(expressID: number, public PlacementRelTo: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public RelativePlacement: IfcAxis2Placement )
	{
			super(expressID);
	}
}
export class IfcLoop extends IfcTopologicalRepresentationItem {
	expressID:number=1008929658;
	constructor(expressID: number, )
	{
			super(expressID);
	}
}
export class IfcMappedItem extends IfcRepresentationItem {
	expressID:number=2347385850;
	constructor(expressID: number, public MappingSource: (Reference<IfcRepresentationMap> | IfcRepresentationMap) , public MappingTarget: (Reference<IfcCartesianTransformationOperator> | IfcCartesianTransformationOperator) )
	{
			super(expressID);
	}
}
export class IfcMaterialDefinitionRepresentation extends IfcProductRepresentation {
	expressID:number=2022407955;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public Representations: (Reference<IfcRepresentation> | IfcRepresentation)[] , public RepresentedMaterial: (Reference<IfcMaterial> | IfcMaterial) )
	{
		super(expressID,Name, Description, Representations);
	}
}
export class IfcMechanicalConcreteMaterialProperties extends IfcMechanicalMaterialProperties {
	expressID:number=1430189142;
	constructor(expressID: number, public Material: (Reference<IfcMaterial> | IfcMaterial) , public DynamicViscosity: IfcDynamicViscosityMeasure | null, public YoungModulus: IfcModulusOfElasticityMeasure | null, public ShearModulus: IfcModulusOfElasticityMeasure | null, public PoissonRatio: IfcPositiveRatioMeasure | null, public ThermalExpansionCoefficient: IfcThermalExpansionCoefficientMeasure | null, public CompressiveStrength: IfcPressureMeasure | null, public MaxAggregateSize: IfcPositiveLengthMeasure | null, public AdmixturesDescription: IfcText | null, public Workability: IfcText | null, public ProtectivePoreRatio: IfcNormalisedRatioMeasure | null, public WaterImpermeability: IfcText | null)
	{
		super(expressID,Material, DynamicViscosity, YoungModulus, ShearModulus, PoissonRatio, ThermalExpansionCoefficient);
	}
}
export class IfcObjectDefinition extends IfcRoot {
	expressID:number=219451334;
	HasAssignments!: (Reference<IfcRelAssigns> | IfcRelAssigns)[] | null;
	IsDecomposedBy!: (Reference<IfcRelDecomposes> | IfcRelDecomposes)[] | null;
	Decomposes!: (Reference<IfcRelDecomposes> | IfcRelDecomposes)[] | null;
	HasAssociations!: (Reference<IfcRelAssociates> | IfcRelAssociates)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcOneDirectionRepeatFactor extends IfcGeometricRepresentationItem {
	expressID:number=2833995503;
	constructor(expressID: number, public RepeatFactor: (Reference<IfcVector> | IfcVector) )
	{
			super(expressID);
	}
}
export class IfcOpenShell extends IfcConnectedFaceSet {
	expressID:number=2665983363;
	constructor(expressID: number, public CfsFaces: (Reference<IfcFace> | IfcFace)[] )
	{
		super(expressID,CfsFaces);
	}
}
export class IfcOrientedEdge extends IfcEdge {
	expressID:number=1029017970;
	constructor(expressID: number, public EdgeElement: (Reference<IfcEdge> | IfcEdge) , public Orientation: boolean )
	{
		super(expressID,new Reference(0), new Reference(0));
	}
}
export class IfcParameterizedProfileDef extends IfcProfileDef {
	expressID:number=2529465313;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) )
	{
		super(expressID,ProfileType, ProfileName);
	}
}
export class IfcPath extends IfcTopologicalRepresentationItem {
	expressID:number=2519244187;
	constructor(expressID: number, public EdgeList: (Reference<IfcOrientedEdge> | IfcOrientedEdge)[] )
	{
			super(expressID);
	}
}
export class IfcPhysicalComplexQuantity extends IfcPhysicalQuantity {
	expressID:number=3021840470;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public HasQuantities: (Reference<IfcPhysicalQuantity> | IfcPhysicalQuantity)[] , public Discrimination: IfcLabel , public Quality: IfcLabel | null, public Usage: IfcLabel | null)
	{
		super(expressID,Name, Description);
	}
}
export class IfcPixelTexture extends IfcSurfaceTexture {
	expressID:number=597895409;
	constructor(expressID: number, public RepeatS: boolean , public RepeatT: boolean , public TextureType: IfcSurfaceTextureEnum , public TextureTransform: (Reference<IfcCartesianTransformationOperator2D> | IfcCartesianTransformationOperator2D) | null, public Width: IfcInteger , public Height: IfcInteger , public ColourComponents: IfcInteger , public Pixel: number[] )
	{
		super(expressID,RepeatS, RepeatT, TextureType, TextureTransform);
	}
}
export class IfcPlacement extends IfcGeometricRepresentationItem {
	expressID:number=2004835150;
	constructor(expressID: number, public Location: (Reference<IfcCartesianPoint> | IfcCartesianPoint) )
	{
			super(expressID);
	}
}
export class IfcPlanarExtent extends IfcGeometricRepresentationItem {
	expressID:number=1663979128;
	constructor(expressID: number, public SizeInX: IfcLengthMeasure , public SizeInY: IfcLengthMeasure )
	{
			super(expressID);
	}
}
export class IfcPoint extends IfcGeometricRepresentationItem {
	expressID:number=2067069095;
	constructor(expressID: number, )
	{
			super(expressID);
	}
}
export class IfcPointOnCurve extends IfcPoint {
	expressID:number=4022376103;
	constructor(expressID: number, public BasisCurve: (Reference<IfcCurve> | IfcCurve) , public PointParameter: IfcParameterValue )
	{
			super(expressID);
	}
}
export class IfcPointOnSurface extends IfcPoint {
	expressID:number=1423911732;
	constructor(expressID: number, public BasisSurface: (Reference<IfcSurface> | IfcSurface) , public PointParameterU: IfcParameterValue , public PointParameterV: IfcParameterValue )
	{
			super(expressID);
	}
}
export class IfcPolyLoop extends IfcLoop {
	expressID:number=2924175390;
	constructor(expressID: number, public Polygon: (Reference<IfcCartesianPoint> | IfcCartesianPoint)[] )
	{
			super(expressID);
	}
}
export class IfcPolygonalBoundedHalfSpace extends IfcHalfSpaceSolid {
	expressID:number=2775532180;
	constructor(expressID: number, public BaseSurface: (Reference<IfcSurface> | IfcSurface) , public AgreementFlag: boolean , public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) , public PolygonalBoundary: (Reference<IfcBoundedCurve> | IfcBoundedCurve) )
	{
		super(expressID,BaseSurface, AgreementFlag);
	}
}
export class IfcPreDefinedColour extends IfcPreDefinedItem {
	expressID:number=759155922;
	constructor(expressID: number, public Name: IfcLabel )
	{
		super(expressID,Name);
	}
}
export class IfcPreDefinedCurveFont extends IfcPreDefinedItem {
	expressID:number=2559016684;
	constructor(expressID: number, public Name: IfcLabel )
	{
		super(expressID,Name);
	}
}
export class IfcPreDefinedDimensionSymbol extends IfcPreDefinedSymbol {
	expressID:number=433424934;
	constructor(expressID: number, public Name: IfcLabel )
	{
		super(expressID,Name);
	}
}
export class IfcPreDefinedPointMarkerSymbol extends IfcPreDefinedSymbol {
	expressID:number=179317114;
	constructor(expressID: number, public Name: IfcLabel )
	{
		super(expressID,Name);
	}
}
export class IfcProductDefinitionShape extends IfcProductRepresentation {
	expressID:number=673634403;
	ShapeOfProduct!: (Reference<IfcProduct> | IfcProduct)[] | null;
	HasShapeAspects!: (Reference<IfcShapeAspect> | IfcShapeAspect)[] | null;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public Representations: (Reference<IfcRepresentation> | IfcRepresentation)[] )
	{
		super(expressID,Name, Description, Representations);
	}
}
export class IfcPropertyBoundedValue extends IfcSimpleProperty {
	expressID:number=871118103;
	constructor(expressID: number, public Name: IfcIdentifier , public Description: IfcText | null, public UpperBoundValue: IfcValue | null, public LowerBoundValue: IfcValue | null, public Unit: IfcUnit | null)
	{
		super(expressID,Name, Description);
	}
}
export class IfcPropertyDefinition extends IfcRoot {
	expressID:number=1680319473;
	HasAssociations!: (Reference<IfcRelAssociates> | IfcRelAssociates)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcPropertyEnumeratedValue extends IfcSimpleProperty {
	expressID:number=4166981789;
	constructor(expressID: number, public Name: IfcIdentifier , public Description: IfcText | null, public EnumerationValues: IfcValue[] , public EnumerationReference: (Reference<IfcPropertyEnumeration> | IfcPropertyEnumeration) | null)
	{
		super(expressID,Name, Description);
	}
}
export class IfcPropertyListValue extends IfcSimpleProperty {
	expressID:number=2752243245;
	constructor(expressID: number, public Name: IfcIdentifier , public Description: IfcText | null, public ListValues: IfcValue[] , public Unit: IfcUnit | null)
	{
		super(expressID,Name, Description);
	}
}
export class IfcPropertyReferenceValue extends IfcSimpleProperty {
	expressID:number=941946838;
	constructor(expressID: number, public Name: IfcIdentifier , public Description: IfcText | null, public UsageName: IfcLabel | null, public PropertyReference: IfcObjectReferenceSelect )
	{
		super(expressID,Name, Description);
	}
}
export class IfcPropertySetDefinition extends IfcPropertyDefinition {
	expressID:number=3357820518;
	PropertyDefinitionOf!: (Reference<IfcRelDefinesByProperties> | IfcRelDefinesByProperties)[] | null;
	DefinesType!: (Reference<IfcTypeObject> | IfcTypeObject)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcPropertySingleValue extends IfcSimpleProperty {
	expressID:number=3650150729;
	constructor(expressID: number, public Name: IfcIdentifier , public Description: IfcText | null, public NominalValue: IfcValue | null, public Unit: IfcUnit | null)
	{
		super(expressID,Name, Description);
	}
}
export class IfcPropertyTableValue extends IfcSimpleProperty {
	expressID:number=110355661;
	constructor(expressID: number, public Name: IfcIdentifier , public Description: IfcText | null, public DefiningValues: IfcValue[] , public DefinedValues: IfcValue[] , public Expression: IfcText | null, public DefiningUnit: IfcUnit | null, public DefinedUnit: IfcUnit | null)
	{
		super(expressID,Name, Description);
	}
}
export class IfcRectangleProfileDef extends IfcParameterizedProfileDef {
	expressID:number=3615266464;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) , public XDim: IfcPositiveLengthMeasure , public YDim: IfcPositiveLengthMeasure )
	{
		super(expressID,ProfileType, ProfileName, Position);
	}
}
export class IfcRegularTimeSeries extends IfcTimeSeries {
	expressID:number=3413951693;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public StartTime: IfcDateTimeSelect , public EndTime: IfcDateTimeSelect , public TimeSeriesDataType: IfcTimeSeriesDataTypeEnum , public DataOrigin: IfcDataOriginEnum , public UserDefinedDataOrigin: IfcLabel | null, public Unit: IfcUnit | null, public TimeStep: IfcTimeMeasure , public Values: (Reference<IfcTimeSeriesValue> | IfcTimeSeriesValue)[] )
	{
		super(expressID,Name, Description, StartTime, EndTime, TimeSeriesDataType, DataOrigin, UserDefinedDataOrigin, Unit);
	}
}
export class IfcReinforcementDefinitionProperties extends IfcPropertySetDefinition {
	expressID:number=3765753017;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public DefinitionType: IfcLabel | null, public ReinforcementSectionDefinitions: (Reference<IfcSectionReinforcementProperties> | IfcSectionReinforcementProperties)[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelationship extends IfcRoot {
	expressID:number=478536968;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRoundedRectangleProfileDef extends IfcRectangleProfileDef {
	expressID:number=2778083089;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) , public XDim: IfcPositiveLengthMeasure , public YDim: IfcPositiveLengthMeasure , public RoundingRadius: IfcPositiveLengthMeasure )
	{
		super(expressID,ProfileType, ProfileName, Position, XDim, YDim);
	}
}
export class IfcSectionedSpine extends IfcGeometricRepresentationItem {
	expressID:number=1509187699;
	constructor(expressID: number, public SpineCurve: (Reference<IfcCompositeCurve> | IfcCompositeCurve) , public CrossSections: (Reference<IfcProfileDef> | IfcProfileDef)[] , public CrossSectionPositions: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D)[] )
	{
			super(expressID);
	}
}
export class IfcServiceLifeFactor extends IfcPropertySetDefinition {
	expressID:number=2411513650;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public PredefinedType: IfcServiceLifeFactorTypeEnum , public UpperValue: IfcMeasureValue | null, public MostUsedValue: IfcMeasureValue , public LowerValue: IfcMeasureValue | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcShellBasedSurfaceModel extends IfcGeometricRepresentationItem {
	expressID:number=4124623270;
	constructor(expressID: number, public SbsmBoundary: IfcShell[] )
	{
			super(expressID);
	}
}
export class IfcSlippageConnectionCondition extends IfcStructuralConnectionCondition {
	expressID:number=2609359061;
	constructor(expressID: number, public Name: IfcLabel | null, public SlippageX: IfcLengthMeasure | null, public SlippageY: IfcLengthMeasure | null, public SlippageZ: IfcLengthMeasure | null)
	{
		super(expressID,Name);
	}
}
export class IfcSolidModel extends IfcGeometricRepresentationItem {
	expressID:number=723233188;
	constructor(expressID: number, )
	{
			super(expressID);
	}
}
export class IfcSoundProperties extends IfcPropertySetDefinition {
	expressID:number=2485662743;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public IsAttenuating: IfcBoolean , public SoundScale: IfcSoundScaleEnum | null, public SoundValues: (Reference<IfcSoundValue> | IfcSoundValue)[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcSoundValue extends IfcPropertySetDefinition {
	expressID:number=1202362311;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public SoundLevelTimeSeries: (Reference<IfcTimeSeries> | IfcTimeSeries) | null, public Frequency: IfcFrequencyMeasure , public SoundLevelSingleValue: IfcDerivedMeasureValue | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcSpaceThermalLoadProperties extends IfcPropertySetDefinition {
	expressID:number=390701378;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableValueRatio: IfcPositiveRatioMeasure | null, public ThermalLoadSource: IfcThermalLoadSourceEnum , public PropertySource: IfcPropertySourceEnum , public SourceDescription: IfcText | null, public MaximumValue: IfcPowerMeasure , public MinimumValue: IfcPowerMeasure | null, public ThermalLoadTimeSeriesValues: (Reference<IfcTimeSeries> | IfcTimeSeries) | null, public UserDefinedThermalLoadSource: IfcLabel | null, public UserDefinedPropertySource: IfcLabel | null, public ThermalLoadType: IfcThermalLoadTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcStructuralLoadLinearForce extends IfcStructuralLoadStatic {
	expressID:number=1595516126;
	constructor(expressID: number, public Name: IfcLabel | null, public LinearForceX: IfcLinearForceMeasure | null, public LinearForceY: IfcLinearForceMeasure | null, public LinearForceZ: IfcLinearForceMeasure | null, public LinearMomentX: IfcLinearMomentMeasure | null, public LinearMomentY: IfcLinearMomentMeasure | null, public LinearMomentZ: IfcLinearMomentMeasure | null)
	{
		super(expressID,Name);
	}
}
export class IfcStructuralLoadPlanarForce extends IfcStructuralLoadStatic {
	expressID:number=2668620305;
	constructor(expressID: number, public Name: IfcLabel | null, public PlanarForceX: IfcPlanarForceMeasure | null, public PlanarForceY: IfcPlanarForceMeasure | null, public PlanarForceZ: IfcPlanarForceMeasure | null)
	{
		super(expressID,Name);
	}
}
export class IfcStructuralLoadSingleDisplacement extends IfcStructuralLoadStatic {
	expressID:number=2473145415;
	constructor(expressID: number, public Name: IfcLabel | null, public DisplacementX: IfcLengthMeasure | null, public DisplacementY: IfcLengthMeasure | null, public DisplacementZ: IfcLengthMeasure | null, public RotationalDisplacementRX: IfcPlaneAngleMeasure | null, public RotationalDisplacementRY: IfcPlaneAngleMeasure | null, public RotationalDisplacementRZ: IfcPlaneAngleMeasure | null)
	{
		super(expressID,Name);
	}
}
export class IfcStructuralLoadSingleDisplacementDistortion extends IfcStructuralLoadSingleDisplacement {
	expressID:number=1973038258;
	constructor(expressID: number, public Name: IfcLabel | null, public DisplacementX: IfcLengthMeasure | null, public DisplacementY: IfcLengthMeasure | null, public DisplacementZ: IfcLengthMeasure | null, public RotationalDisplacementRX: IfcPlaneAngleMeasure | null, public RotationalDisplacementRY: IfcPlaneAngleMeasure | null, public RotationalDisplacementRZ: IfcPlaneAngleMeasure | null, public Distortion: IfcCurvatureMeasure | null)
	{
		super(expressID,Name, DisplacementX, DisplacementY, DisplacementZ, RotationalDisplacementRX, RotationalDisplacementRY, RotationalDisplacementRZ);
	}
}
export class IfcStructuralLoadSingleForce extends IfcStructuralLoadStatic {
	expressID:number=1597423693;
	constructor(expressID: number, public Name: IfcLabel | null, public ForceX: IfcForceMeasure | null, public ForceY: IfcForceMeasure | null, public ForceZ: IfcForceMeasure | null, public MomentX: IfcTorqueMeasure | null, public MomentY: IfcTorqueMeasure | null, public MomentZ: IfcTorqueMeasure | null)
	{
		super(expressID,Name);
	}
}
export class IfcStructuralLoadSingleForceWarping extends IfcStructuralLoadSingleForce {
	expressID:number=1190533807;
	constructor(expressID: number, public Name: IfcLabel | null, public ForceX: IfcForceMeasure | null, public ForceY: IfcForceMeasure | null, public ForceZ: IfcForceMeasure | null, public MomentX: IfcTorqueMeasure | null, public MomentY: IfcTorqueMeasure | null, public MomentZ: IfcTorqueMeasure | null, public WarpingMoment: IfcWarpingMomentMeasure | null)
	{
		super(expressID,Name, ForceX, ForceY, ForceZ, MomentX, MomentY, MomentZ);
	}
}
export class IfcStructuralProfileProperties extends IfcGeneralProfileProperties {
	expressID:number=3843319758;
	constructor(expressID: number, public ProfileName: IfcLabel | null, public ProfileDefinition: (Reference<IfcProfileDef> | IfcProfileDef) | null, public PhysicalWeight: IfcMassPerLengthMeasure | null, public Perimeter: IfcPositiveLengthMeasure | null, public MinimumPlateThickness: IfcPositiveLengthMeasure | null, public MaximumPlateThickness: IfcPositiveLengthMeasure | null, public CrossSectionArea: IfcAreaMeasure | null, public TorsionalConstantX: IfcMomentOfInertiaMeasure | null, public MomentOfInertiaYZ: IfcMomentOfInertiaMeasure | null, public MomentOfInertiaY: IfcMomentOfInertiaMeasure | null, public MomentOfInertiaZ: IfcMomentOfInertiaMeasure | null, public WarpingConstant: IfcWarpingConstantMeasure | null, public ShearCentreZ: IfcLengthMeasure | null, public ShearCentreY: IfcLengthMeasure | null, public ShearDeformationAreaZ: IfcAreaMeasure | null, public ShearDeformationAreaY: IfcAreaMeasure | null, public MaximumSectionModulusY: IfcSectionModulusMeasure | null, public MinimumSectionModulusY: IfcSectionModulusMeasure | null, public MaximumSectionModulusZ: IfcSectionModulusMeasure | null, public MinimumSectionModulusZ: IfcSectionModulusMeasure | null, public TorsionalSectionModulus: IfcSectionModulusMeasure | null, public CentreOfGravityInX: IfcLengthMeasure | null, public CentreOfGravityInY: IfcLengthMeasure | null)
	{
		super(expressID,ProfileName, ProfileDefinition, PhysicalWeight, Perimeter, MinimumPlateThickness, MaximumPlateThickness, CrossSectionArea);
	}
}
export class IfcStructuralSteelProfileProperties extends IfcStructuralProfileProperties {
	expressID:number=3653947884;
	constructor(expressID: number, public ProfileName: IfcLabel | null, public ProfileDefinition: (Reference<IfcProfileDef> | IfcProfileDef) | null, public PhysicalWeight: IfcMassPerLengthMeasure | null, public Perimeter: IfcPositiveLengthMeasure | null, public MinimumPlateThickness: IfcPositiveLengthMeasure | null, public MaximumPlateThickness: IfcPositiveLengthMeasure | null, public CrossSectionArea: IfcAreaMeasure | null, public TorsionalConstantX: IfcMomentOfInertiaMeasure | null, public MomentOfInertiaYZ: IfcMomentOfInertiaMeasure | null, public MomentOfInertiaY: IfcMomentOfInertiaMeasure | null, public MomentOfInertiaZ: IfcMomentOfInertiaMeasure | null, public WarpingConstant: IfcWarpingConstantMeasure | null, public ShearCentreZ: IfcLengthMeasure | null, public ShearCentreY: IfcLengthMeasure | null, public ShearDeformationAreaZ: IfcAreaMeasure | null, public ShearDeformationAreaY: IfcAreaMeasure | null, public MaximumSectionModulusY: IfcSectionModulusMeasure | null, public MinimumSectionModulusY: IfcSectionModulusMeasure | null, public MaximumSectionModulusZ: IfcSectionModulusMeasure | null, public MinimumSectionModulusZ: IfcSectionModulusMeasure | null, public TorsionalSectionModulus: IfcSectionModulusMeasure | null, public CentreOfGravityInX: IfcLengthMeasure | null, public CentreOfGravityInY: IfcLengthMeasure | null, public ShearAreaZ: IfcAreaMeasure | null, public ShearAreaY: IfcAreaMeasure | null, public PlasticShapeFactorY: IfcPositiveRatioMeasure | null, public PlasticShapeFactorZ: IfcPositiveRatioMeasure | null)
	{
		super(expressID,ProfileName, ProfileDefinition, PhysicalWeight, Perimeter, MinimumPlateThickness, MaximumPlateThickness, CrossSectionArea, TorsionalConstantX, MomentOfInertiaYZ, MomentOfInertiaY, MomentOfInertiaZ, WarpingConstant, ShearCentreZ, ShearCentreY, ShearDeformationAreaZ, ShearDeformationAreaY, MaximumSectionModulusY, MinimumSectionModulusY, MaximumSectionModulusZ, MinimumSectionModulusZ, TorsionalSectionModulus, CentreOfGravityInX, CentreOfGravityInY);
	}
}
export class IfcSubedge extends IfcEdge {
	expressID:number=2233826070;
	constructor(expressID: number, public EdgeStart: (Reference<IfcVertex> | IfcVertex) , public EdgeEnd: (Reference<IfcVertex> | IfcVertex) , public ParentEdge: (Reference<IfcEdge> | IfcEdge) )
	{
		super(expressID,EdgeStart, EdgeEnd);
	}
}
export class IfcSurface extends IfcGeometricRepresentationItem {
	expressID:number=2513912981;
	constructor(expressID: number, )
	{
			super(expressID);
	}
}
export class IfcSurfaceStyleRendering extends IfcSurfaceStyleShading {
	expressID:number=1878645084;
	constructor(expressID: number, public SurfaceColour: (Reference<IfcColourRgb> | IfcColourRgb) , public Transparency: IfcNormalisedRatioMeasure | null, public DiffuseColour: IfcColourOrFactor | null, public TransmissionColour: IfcColourOrFactor | null, public DiffuseTransmissionColour: IfcColourOrFactor | null, public ReflectionColour: IfcColourOrFactor | null, public SpecularColour: IfcColourOrFactor | null, public SpecularHighlight: IfcSpecularHighlightSelect | null, public ReflectanceMethod: IfcReflectanceMethodEnum )
	{
		super(expressID,SurfaceColour);
	}
}
export class IfcSweptAreaSolid extends IfcSolidModel {
	expressID:number=2247615214;
	constructor(expressID: number, public SweptArea: (Reference<IfcProfileDef> | IfcProfileDef) , public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) )
	{
			super(expressID);
	}
}
export class IfcSweptDiskSolid extends IfcSolidModel {
	expressID:number=1260650574;
	constructor(expressID: number, public Directrix: (Reference<IfcCurve> | IfcCurve) , public Radius: IfcPositiveLengthMeasure , public InnerRadius: IfcPositiveLengthMeasure | null, public StartParam: IfcParameterValue , public EndParam: IfcParameterValue )
	{
			super(expressID);
	}
}
export class IfcSweptSurface extends IfcSurface {
	expressID:number=230924584;
	constructor(expressID: number, public SweptCurve: (Reference<IfcProfileDef> | IfcProfileDef) , public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) )
	{
			super(expressID);
	}
}
export class IfcTShapeProfileDef extends IfcParameterizedProfileDef {
	expressID:number=3071757647;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) , public Depth: IfcPositiveLengthMeasure , public FlangeWidth: IfcPositiveLengthMeasure , public WebThickness: IfcPositiveLengthMeasure , public FlangeThickness: IfcPositiveLengthMeasure , public FilletRadius: IfcPositiveLengthMeasure | null, public FlangeEdgeRadius: IfcPositiveLengthMeasure | null, public WebEdgeRadius: IfcPositiveLengthMeasure | null, public WebSlope: IfcPlaneAngleMeasure | null, public FlangeSlope: IfcPlaneAngleMeasure | null, public CentreOfGravityInY: IfcPositiveLengthMeasure | null)
	{
		super(expressID,ProfileType, ProfileName, Position);
	}
}
export class IfcTerminatorSymbol extends IfcAnnotationSymbolOccurrence {
	expressID:number=3028897424;
	constructor(expressID: number, public Item: (Reference<IfcRepresentationItem> | IfcRepresentationItem) | null, public Styles: (Reference<IfcPresentationStyleAssignment> | IfcPresentationStyleAssignment)[] , public Name: IfcLabel | null, public AnnotatedCurve: (Reference<IfcAnnotationCurveOccurrence> | IfcAnnotationCurveOccurrence) )
	{
		super(expressID,Item, Styles, Name);
	}
}
export class IfcTextLiteral extends IfcGeometricRepresentationItem {
	expressID:number=4282788508;
	constructor(expressID: number, public Literal: IfcPresentableText , public Placement: IfcAxis2Placement , public Path: IfcTextPath )
	{
			super(expressID);
	}
}
export class IfcTextLiteralWithExtent extends IfcTextLiteral {
	expressID:number=3124975700;
	constructor(expressID: number, public Literal: IfcPresentableText , public Placement: IfcAxis2Placement , public Path: IfcTextPath , public Extent: (Reference<IfcPlanarExtent> | IfcPlanarExtent) , public BoxAlignment: IfcBoxAlignment )
	{
		super(expressID,Literal, Placement, Path);
	}
}
export class IfcTrapeziumProfileDef extends IfcParameterizedProfileDef {
	expressID:number=2715220739;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) , public BottomXDim: IfcPositiveLengthMeasure , public TopXDim: IfcPositiveLengthMeasure , public YDim: IfcPositiveLengthMeasure , public TopXOffset: IfcLengthMeasure )
	{
		super(expressID,ProfileType, ProfileName, Position);
	}
}
export class IfcTwoDirectionRepeatFactor extends IfcOneDirectionRepeatFactor {
	expressID:number=1345879162;
	constructor(expressID: number, public RepeatFactor: (Reference<IfcVector> | IfcVector) , public SecondRepeatFactor: (Reference<IfcVector> | IfcVector) )
	{
		super(expressID,RepeatFactor);
	}
}
export class IfcTypeObject extends IfcObjectDefinition {
	expressID:number=1628702193;
	ObjectTypeOf!: (Reference<IfcRelDefinesByType> | IfcRelDefinesByType)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcTypeProduct extends IfcTypeObject {
	expressID:number=2347495698;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets);
	}
}
export class IfcUShapeProfileDef extends IfcParameterizedProfileDef {
	expressID:number=427810014;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) , public Depth: IfcPositiveLengthMeasure , public FlangeWidth: IfcPositiveLengthMeasure , public WebThickness: IfcPositiveLengthMeasure , public FlangeThickness: IfcPositiveLengthMeasure , public FilletRadius: IfcPositiveLengthMeasure | null, public EdgeRadius: IfcPositiveLengthMeasure | null, public FlangeSlope: IfcPlaneAngleMeasure | null, public CentreOfGravityInX: IfcPositiveLengthMeasure | null)
	{
		super(expressID,ProfileType, ProfileName, Position);
	}
}
export class IfcVector extends IfcGeometricRepresentationItem {
	expressID:number=1417489154;
	constructor(expressID: number, public Orientation: (Reference<IfcDirection> | IfcDirection) , public Magnitude: IfcLengthMeasure )
	{
			super(expressID);
	}
}
export class IfcVertexLoop extends IfcLoop {
	expressID:number=2759199220;
	constructor(expressID: number, public LoopVertex: (Reference<IfcVertex> | IfcVertex) )
	{
			super(expressID);
	}
}
export class IfcWindowLiningProperties extends IfcPropertySetDefinition {
	expressID:number=336235671;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public LiningDepth: IfcPositiveLengthMeasure | null, public LiningThickness: IfcPositiveLengthMeasure | null, public TransomThickness: IfcPositiveLengthMeasure | null, public MullionThickness: IfcPositiveLengthMeasure | null, public FirstTransomOffset: IfcNormalisedRatioMeasure | null, public SecondTransomOffset: IfcNormalisedRatioMeasure | null, public FirstMullionOffset: IfcNormalisedRatioMeasure | null, public SecondMullionOffset: IfcNormalisedRatioMeasure | null, public ShapeAspectStyle: (Reference<IfcShapeAspect> | IfcShapeAspect) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcWindowPanelProperties extends IfcPropertySetDefinition {
	expressID:number=512836454;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public OperationType: IfcWindowPanelOperationEnum , public PanelPosition: IfcWindowPanelPositionEnum , public FrameDepth: IfcPositiveLengthMeasure | null, public FrameThickness: IfcPositiveLengthMeasure | null, public ShapeAspectStyle: (Reference<IfcShapeAspect> | IfcShapeAspect) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcWindowStyle extends IfcTypeProduct {
	expressID:number=1299126871;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ConstructionType: IfcWindowStyleConstructionEnum , public OperationType: IfcWindowStyleOperationEnum , public ParameterTakesPrecedence: boolean , public Sizeable: boolean )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag);
	}
}
export class IfcZShapeProfileDef extends IfcParameterizedProfileDef {
	expressID:number=2543172580;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) , public Depth: IfcPositiveLengthMeasure , public FlangeWidth: IfcPositiveLengthMeasure , public WebThickness: IfcPositiveLengthMeasure , public FlangeThickness: IfcPositiveLengthMeasure , public FilletRadius: IfcPositiveLengthMeasure | null, public EdgeRadius: IfcPositiveLengthMeasure | null)
	{
		super(expressID,ProfileType, ProfileName, Position);
	}
}
export class IfcAnnotationCurveOccurrence extends IfcAnnotationOccurrence {
	expressID:number=3288037868;
	constructor(expressID: number, public Item: (Reference<IfcRepresentationItem> | IfcRepresentationItem) | null, public Styles: (Reference<IfcPresentationStyleAssignment> | IfcPresentationStyleAssignment)[] , public Name: IfcLabel | null)
	{
		super(expressID,Item, Styles, Name);
	}
}
export class IfcAnnotationFillArea extends IfcGeometricRepresentationItem {
	expressID:number=669184980;
	constructor(expressID: number, public OuterBoundary: (Reference<IfcCurve> | IfcCurve) , public InnerBoundaries: (Reference<IfcCurve> | IfcCurve)[] | null)
	{
			super(expressID);
	}
}
export class IfcAnnotationFillAreaOccurrence extends IfcAnnotationOccurrence {
	expressID:number=2265737646;
	constructor(expressID: number, public Item: (Reference<IfcRepresentationItem> | IfcRepresentationItem) | null, public Styles: (Reference<IfcPresentationStyleAssignment> | IfcPresentationStyleAssignment)[] , public Name: IfcLabel | null, public FillStyleTarget: (Reference<IfcPoint> | IfcPoint) | null, public GlobalOrLocal: IfcGlobalOrLocalEnum | null)
	{
		super(expressID,Item, Styles, Name);
	}
}
export class IfcAnnotationSurface extends IfcGeometricRepresentationItem {
	expressID:number=1302238472;
	constructor(expressID: number, public Item: (Reference<IfcGeometricRepresentationItem> | IfcGeometricRepresentationItem) , public TextureCoordinates: (Reference<IfcTextureCoordinate> | IfcTextureCoordinate) | null)
	{
			super(expressID);
	}
}
export class IfcAxis1Placement extends IfcPlacement {
	expressID:number=4261334040;
	constructor(expressID: number, public Location: (Reference<IfcCartesianPoint> | IfcCartesianPoint) , public Axis: (Reference<IfcDirection> | IfcDirection) | null)
	{
		super(expressID,Location);
	}
}
export class IfcAxis2Placement2D extends IfcPlacement {
	expressID:number=3125803723;
	constructor(expressID: number, public Location: (Reference<IfcCartesianPoint> | IfcCartesianPoint) , public RefDirection: (Reference<IfcDirection> | IfcDirection) | null)
	{
		super(expressID,Location);
	}
}
export class IfcAxis2Placement3D extends IfcPlacement {
	expressID:number=2740243338;
	constructor(expressID: number, public Location: (Reference<IfcCartesianPoint> | IfcCartesianPoint) , public Axis: (Reference<IfcDirection> | IfcDirection) | null, public RefDirection: (Reference<IfcDirection> | IfcDirection) | null)
	{
		super(expressID,Location);
	}
}
export class IfcBooleanResult extends IfcGeometricRepresentationItem {
	expressID:number=2736907675;
	constructor(expressID: number, public Operator: IfcBooleanOperator , public FirstOperand: IfcBooleanOperand , public SecondOperand: IfcBooleanOperand )
	{
			super(expressID);
	}
}
export class IfcBoundedSurface extends IfcSurface {
	expressID:number=4182860854;
	constructor(expressID: number, )
	{
			super(expressID);
	}
}
export class IfcBoundingBox extends IfcGeometricRepresentationItem {
	expressID:number=2581212453;
	constructor(expressID: number, public Corner: (Reference<IfcCartesianPoint> | IfcCartesianPoint) , public XDim: IfcPositiveLengthMeasure , public YDim: IfcPositiveLengthMeasure , public ZDim: IfcPositiveLengthMeasure )
	{
			super(expressID);
	}
}
export class IfcBoxedHalfSpace extends IfcHalfSpaceSolid {
	expressID:number=2713105998;
	constructor(expressID: number, public BaseSurface: (Reference<IfcSurface> | IfcSurface) , public AgreementFlag: boolean , public Enclosure: (Reference<IfcBoundingBox> | IfcBoundingBox) )
	{
		super(expressID,BaseSurface, AgreementFlag);
	}
}
export class IfcCShapeProfileDef extends IfcParameterizedProfileDef {
	expressID:number=2898889636;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) , public Depth: IfcPositiveLengthMeasure , public Width: IfcPositiveLengthMeasure , public WallThickness: IfcPositiveLengthMeasure , public Girth: IfcPositiveLengthMeasure , public InternalFilletRadius: IfcPositiveLengthMeasure | null, public CentreOfGravityInX: IfcPositiveLengthMeasure | null)
	{
		super(expressID,ProfileType, ProfileName, Position);
	}
}
export class IfcCartesianPoint extends IfcPoint {
	expressID:number=1123145078;
	constructor(expressID: number, public Coordinates: IfcLengthMeasure[] )
	{
			super(expressID);
	}
}
export class IfcCartesianTransformationOperator extends IfcGeometricRepresentationItem {
	expressID:number=59481748;
	constructor(expressID: number, public Axis1: (Reference<IfcDirection> | IfcDirection) | null, public Axis2: (Reference<IfcDirection> | IfcDirection) | null, public LocalOrigin: (Reference<IfcCartesianPoint> | IfcCartesianPoint) , public Scale: number | null)
	{
			super(expressID);
	}
}
export class IfcCartesianTransformationOperator2D extends IfcCartesianTransformationOperator {
	expressID:number=3749851601;
	constructor(expressID: number, public Axis1: (Reference<IfcDirection> | IfcDirection) | null, public Axis2: (Reference<IfcDirection> | IfcDirection) | null, public LocalOrigin: (Reference<IfcCartesianPoint> | IfcCartesianPoint) , public Scale: number | null)
	{
		super(expressID,Axis1, Axis2, LocalOrigin, Scale);
	}
}
export class IfcCartesianTransformationOperator2DnonUniform extends IfcCartesianTransformationOperator2D {
	expressID:number=3486308946;
	constructor(expressID: number, public Axis1: (Reference<IfcDirection> | IfcDirection) | null, public Axis2: (Reference<IfcDirection> | IfcDirection) | null, public LocalOrigin: (Reference<IfcCartesianPoint> | IfcCartesianPoint) , public Scale: number | null, public Scale2: number | null)
	{
		super(expressID,Axis1, Axis2, LocalOrigin, Scale);
	}
}
export class IfcCartesianTransformationOperator3D extends IfcCartesianTransformationOperator {
	expressID:number=3331915920;
	constructor(expressID: number, public Axis1: (Reference<IfcDirection> | IfcDirection) | null, public Axis2: (Reference<IfcDirection> | IfcDirection) | null, public LocalOrigin: (Reference<IfcCartesianPoint> | IfcCartesianPoint) , public Scale: number | null, public Axis3: (Reference<IfcDirection> | IfcDirection) | null)
	{
		super(expressID,Axis1, Axis2, LocalOrigin, Scale);
	}
}
export class IfcCartesianTransformationOperator3DnonUniform extends IfcCartesianTransformationOperator3D {
	expressID:number=1416205885;
	constructor(expressID: number, public Axis1: (Reference<IfcDirection> | IfcDirection) | null, public Axis2: (Reference<IfcDirection> | IfcDirection) | null, public LocalOrigin: (Reference<IfcCartesianPoint> | IfcCartesianPoint) , public Scale: number | null, public Axis3: (Reference<IfcDirection> | IfcDirection) | null, public Scale2: number | null, public Scale3: number | null)
	{
		super(expressID,Axis1, Axis2, LocalOrigin, Scale, Axis3);
	}
}
export class IfcCircleProfileDef extends IfcParameterizedProfileDef {
	expressID:number=1383045692;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) , public Radius: IfcPositiveLengthMeasure )
	{
		super(expressID,ProfileType, ProfileName, Position);
	}
}
export class IfcClosedShell extends IfcConnectedFaceSet {
	expressID:number=2205249479;
	constructor(expressID: number, public CfsFaces: (Reference<IfcFace> | IfcFace)[] )
	{
		super(expressID,CfsFaces);
	}
}
export class IfcCompositeCurveSegment extends IfcGeometricRepresentationItem {
	expressID:number=2485617015;
	UsingCurves!: (Reference<IfcCompositeCurve> | IfcCompositeCurve)[] | null;
	constructor(expressID: number, public Transition: IfcTransitionCode , public SameSense: boolean , public ParentCurve: (Reference<IfcCurve> | IfcCurve) )
	{
			super(expressID);
	}
}
export class IfcCraneRailAShapeProfileDef extends IfcParameterizedProfileDef {
	expressID:number=4133800736;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) , public OverallHeight: IfcPositiveLengthMeasure , public BaseWidth2: IfcPositiveLengthMeasure , public Radius: IfcPositiveLengthMeasure | null, public HeadWidth: IfcPositiveLengthMeasure , public HeadDepth2: IfcPositiveLengthMeasure , public HeadDepth3: IfcPositiveLengthMeasure , public WebThickness: IfcPositiveLengthMeasure , public BaseWidth4: IfcPositiveLengthMeasure , public BaseDepth1: IfcPositiveLengthMeasure , public BaseDepth2: IfcPositiveLengthMeasure , public BaseDepth3: IfcPositiveLengthMeasure , public CentreOfGravityInY: IfcPositiveLengthMeasure | null)
	{
		super(expressID,ProfileType, ProfileName, Position);
	}
}
export class IfcCraneRailFShapeProfileDef extends IfcParameterizedProfileDef {
	expressID:number=194851669;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) , public OverallHeight: IfcPositiveLengthMeasure , public HeadWidth: IfcPositiveLengthMeasure , public Radius: IfcPositiveLengthMeasure | null, public HeadDepth2: IfcPositiveLengthMeasure , public HeadDepth3: IfcPositiveLengthMeasure , public WebThickness: IfcPositiveLengthMeasure , public BaseDepth1: IfcPositiveLengthMeasure , public BaseDepth2: IfcPositiveLengthMeasure , public CentreOfGravityInY: IfcPositiveLengthMeasure | null)
	{
		super(expressID,ProfileType, ProfileName, Position);
	}
}
export class IfcCsgPrimitive3D extends IfcGeometricRepresentationItem {
	expressID:number=2506170314;
	constructor(expressID: number, public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) )
	{
			super(expressID);
	}
}
export class IfcCsgSolid extends IfcSolidModel {
	expressID:number=2147822146;
	constructor(expressID: number, public TreeRootExpression: IfcCsgSelect )
	{
			super(expressID);
	}
}
export class IfcCurve extends IfcGeometricRepresentationItem {
	expressID:number=2601014836;
	constructor(expressID: number, )
	{
			super(expressID);
	}
}
export class IfcCurveBoundedPlane extends IfcBoundedSurface {
	expressID:number=2827736869;
	constructor(expressID: number, public BasisSurface: (Reference<IfcPlane> | IfcPlane) , public OuterBoundary: (Reference<IfcCurve> | IfcCurve) , public InnerBoundaries: (Reference<IfcCurve> | IfcCurve)[] )
	{
			super(expressID);
	}
}
export class IfcDefinedSymbol extends IfcGeometricRepresentationItem {
	expressID:number=693772133;
	constructor(expressID: number, public Definition: IfcDefinedSymbolSelect , public Target: (Reference<IfcCartesianTransformationOperator2D> | IfcCartesianTransformationOperator2D) )
	{
			super(expressID);
	}
}
export class IfcDimensionCurve extends IfcAnnotationCurveOccurrence {
	expressID:number=606661476;
	AnnotatedBySymbols!: (Reference<IfcTerminatorSymbol> | IfcTerminatorSymbol)[] | null;
	constructor(expressID: number, public Item: (Reference<IfcRepresentationItem> | IfcRepresentationItem) | null, public Styles: (Reference<IfcPresentationStyleAssignment> | IfcPresentationStyleAssignment)[] , public Name: IfcLabel | null)
	{
		super(expressID,Item, Styles, Name);
	}
}
export class IfcDimensionCurveTerminator extends IfcTerminatorSymbol {
	expressID:number=4054601972;
	constructor(expressID: number, public Item: (Reference<IfcRepresentationItem> | IfcRepresentationItem) | null, public Styles: (Reference<IfcPresentationStyleAssignment> | IfcPresentationStyleAssignment)[] , public Name: IfcLabel | null, public AnnotatedCurve: (Reference<IfcAnnotationCurveOccurrence> | IfcAnnotationCurveOccurrence) , public Role: IfcDimensionExtentUsage )
	{
		super(expressID,Item, Styles, Name, AnnotatedCurve);
	}
}
export class IfcDirection extends IfcGeometricRepresentationItem {
	expressID:number=32440307;
	constructor(expressID: number, public DirectionRatios: number[] )
	{
			super(expressID);
	}
}
export class IfcDoorLiningProperties extends IfcPropertySetDefinition {
	expressID:number=2963535650;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public LiningDepth: IfcPositiveLengthMeasure | null, public LiningThickness: IfcPositiveLengthMeasure | null, public ThresholdDepth: IfcPositiveLengthMeasure | null, public ThresholdThickness: IfcPositiveLengthMeasure | null, public TransomThickness: IfcPositiveLengthMeasure | null, public TransomOffset: IfcLengthMeasure | null, public LiningOffset: IfcLengthMeasure | null, public ThresholdOffset: IfcLengthMeasure | null, public CasingThickness: IfcPositiveLengthMeasure | null, public CasingDepth: IfcPositiveLengthMeasure | null, public ShapeAspectStyle: (Reference<IfcShapeAspect> | IfcShapeAspect) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcDoorPanelProperties extends IfcPropertySetDefinition {
	expressID:number=1714330368;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public PanelDepth: IfcPositiveLengthMeasure | null, public PanelOperation: IfcDoorPanelOperationEnum , public PanelWidth: IfcNormalisedRatioMeasure | null, public PanelPosition: IfcDoorPanelPositionEnum , public ShapeAspectStyle: (Reference<IfcShapeAspect> | IfcShapeAspect) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcDoorStyle extends IfcTypeProduct {
	expressID:number=526551008;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public OperationType: IfcDoorStyleOperationEnum , public ConstructionType: IfcDoorStyleConstructionEnum , public ParameterTakesPrecedence: boolean , public Sizeable: boolean )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag);
	}
}
export class IfcDraughtingCallout extends IfcGeometricRepresentationItem {
	expressID:number=3073041342;
	IsRelatedFromCallout!: (Reference<IfcDraughtingCalloutRelationship> | IfcDraughtingCalloutRelationship)[] | null;
	IsRelatedToCallout!: (Reference<IfcDraughtingCalloutRelationship> | IfcDraughtingCalloutRelationship)[] | null;
	constructor(expressID: number, public Contents: IfcDraughtingCalloutElement[] )
	{
			super(expressID);
	}
}
export class IfcDraughtingPreDefinedColour extends IfcPreDefinedColour {
	expressID:number=445594917;
	constructor(expressID: number, public Name: IfcLabel )
	{
		super(expressID,Name);
	}
}
export class IfcDraughtingPreDefinedCurveFont extends IfcPreDefinedCurveFont {
	expressID:number=4006246654;
	constructor(expressID: number, public Name: IfcLabel )
	{
		super(expressID,Name);
	}
}
export class IfcEdgeLoop extends IfcLoop {
	expressID:number=1472233963;
	constructor(expressID: number, public EdgeList: (Reference<IfcOrientedEdge> | IfcOrientedEdge)[] )
	{
			super(expressID);
	}
}
export class IfcElementQuantity extends IfcPropertySetDefinition {
	expressID:number=1883228015;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public MethodOfMeasurement: IfcLabel | null, public Quantities: (Reference<IfcPhysicalQuantity> | IfcPhysicalQuantity)[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcElementType extends IfcTypeProduct {
	expressID:number=339256511;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag);
	}
}
export class IfcElementarySurface extends IfcSurface {
	expressID:number=2777663545;
	constructor(expressID: number, public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) )
	{
			super(expressID);
	}
}
export class IfcEllipseProfileDef extends IfcParameterizedProfileDef {
	expressID:number=2835456948;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) , public SemiAxis1: IfcPositiveLengthMeasure , public SemiAxis2: IfcPositiveLengthMeasure )
	{
		super(expressID,ProfileType, ProfileName, Position);
	}
}
export class IfcEnergyProperties extends IfcPropertySetDefinition {
	expressID:number=80994333;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public EnergySequence: IfcEnergySequenceEnum | null, public UserDefinedEnergySequence: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcExtrudedAreaSolid extends IfcSweptAreaSolid {
	expressID:number=477187591;
	constructor(expressID: number, public SweptArea: (Reference<IfcProfileDef> | IfcProfileDef) , public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) , public ExtrudedDirection: (Reference<IfcDirection> | IfcDirection) , public Depth: IfcPositiveLengthMeasure )
	{
		super(expressID,SweptArea, Position);
	}
}
export class IfcFaceBasedSurfaceModel extends IfcGeometricRepresentationItem {
	expressID:number=2047409740;
	constructor(expressID: number, public FbsmFaces: (Reference<IfcConnectedFaceSet> | IfcConnectedFaceSet)[] )
	{
			super(expressID);
	}
}
export class IfcFillAreaStyleHatching extends IfcGeometricRepresentationItem {
	expressID:number=374418227;
	constructor(expressID: number, public HatchLineAppearance: (Reference<IfcCurveStyle> | IfcCurveStyle) , public StartOfNextHatchLine: IfcHatchLineDistanceSelect , public PointOfReferenceHatchLine: (Reference<IfcCartesianPoint> | IfcCartesianPoint) | null, public PatternStart: (Reference<IfcCartesianPoint> | IfcCartesianPoint) | null, public HatchLineAngle: IfcPlaneAngleMeasure )
	{
			super(expressID);
	}
}
export class IfcFillAreaStyleTileSymbolWithStyle extends IfcGeometricRepresentationItem {
	expressID:number=4203026998;
	constructor(expressID: number, public Symbol: (Reference<IfcAnnotationSymbolOccurrence> | IfcAnnotationSymbolOccurrence) )
	{
			super(expressID);
	}
}
export class IfcFillAreaStyleTiles extends IfcGeometricRepresentationItem {
	expressID:number=315944413;
	constructor(expressID: number, public TilingPattern: (Reference<IfcOneDirectionRepeatFactor> | IfcOneDirectionRepeatFactor) , public Tiles: IfcFillAreaStyleTileShapeSelect[] , public TilingScale: IfcPositiveRatioMeasure )
	{
			super(expressID);
	}
}
export class IfcFluidFlowProperties extends IfcPropertySetDefinition {
	expressID:number=3455213021;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public PropertySource: IfcPropertySourceEnum , public FlowConditionTimeSeries: (Reference<IfcTimeSeries> | IfcTimeSeries) | null, public VelocityTimeSeries: (Reference<IfcTimeSeries> | IfcTimeSeries) | null, public FlowrateTimeSeries: (Reference<IfcTimeSeries> | IfcTimeSeries) | null, public Fluid: (Reference<IfcMaterial> | IfcMaterial) , public PressureTimeSeries: (Reference<IfcTimeSeries> | IfcTimeSeries) | null, public UserDefinedPropertySource: IfcLabel | null, public TemperatureSingleValue: IfcThermodynamicTemperatureMeasure | null, public WetBulbTemperatureSingleValue: IfcThermodynamicTemperatureMeasure | null, public WetBulbTemperatureTimeSeries: (Reference<IfcTimeSeries> | IfcTimeSeries) | null, public TemperatureTimeSeries: (Reference<IfcTimeSeries> | IfcTimeSeries) | null, public FlowrateSingleValue: IfcDerivedMeasureValue | null, public FlowConditionSingleValue: IfcPositiveRatioMeasure | null, public VelocitySingleValue: IfcLinearVelocityMeasure | null, public PressureSingleValue: IfcPressureMeasure | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcFurnishingElementType extends IfcElementType {
	expressID:number=4238390223;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFurnitureType extends IfcFurnishingElementType {
	expressID:number=1268542332;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public AssemblyPlace: IfcAssemblyPlaceEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcGeometricCurveSet extends IfcGeometricSet {
	expressID:number=987898635;
	constructor(expressID: number, public Elements: IfcGeometricSetSelect[] )
	{
		super(expressID,Elements);
	}
}
export class IfcIShapeProfileDef extends IfcParameterizedProfileDef {
	expressID:number=1484403080;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) , public OverallWidth: IfcPositiveLengthMeasure , public OverallDepth: IfcPositiveLengthMeasure , public WebThickness: IfcPositiveLengthMeasure , public FlangeThickness: IfcPositiveLengthMeasure , public FilletRadius: IfcPositiveLengthMeasure | null)
	{
		super(expressID,ProfileType, ProfileName, Position);
	}
}
export class IfcLShapeProfileDef extends IfcParameterizedProfileDef {
	expressID:number=572779678;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) , public Depth: IfcPositiveLengthMeasure , public Width: IfcPositiveLengthMeasure | null, public Thickness: IfcPositiveLengthMeasure , public FilletRadius: IfcPositiveLengthMeasure | null, public EdgeRadius: IfcPositiveLengthMeasure | null, public LegSlope: IfcPlaneAngleMeasure | null, public CentreOfGravityInX: IfcPositiveLengthMeasure | null, public CentreOfGravityInY: IfcPositiveLengthMeasure | null)
	{
		super(expressID,ProfileType, ProfileName, Position);
	}
}
export class IfcLine extends IfcCurve {
	expressID:number=1281925730;
	constructor(expressID: number, public Pnt: (Reference<IfcCartesianPoint> | IfcCartesianPoint) , public Dir: (Reference<IfcVector> | IfcVector) )
	{
			super(expressID);
	}
}
export class IfcManifoldSolidBrep extends IfcSolidModel {
	expressID:number=1425443689;
	constructor(expressID: number, public Outer: (Reference<IfcClosedShell> | IfcClosedShell) )
	{
			super(expressID);
	}
}
export class IfcObject extends IfcObjectDefinition {
	expressID:number=3888040117;
	IsDefinedBy!: (Reference<IfcRelDefines> | IfcRelDefines)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcOffsetCurve2D extends IfcCurve {
	expressID:number=3388369263;
	constructor(expressID: number, public BasisCurve: (Reference<IfcCurve> | IfcCurve) , public Distance: IfcLengthMeasure , public SelfIntersect: boolean )
	{
			super(expressID);
	}
}
export class IfcOffsetCurve3D extends IfcCurve {
	expressID:number=3505215534;
	constructor(expressID: number, public BasisCurve: (Reference<IfcCurve> | IfcCurve) , public Distance: IfcLengthMeasure , public SelfIntersect: boolean , public RefDirection: (Reference<IfcDirection> | IfcDirection) )
	{
			super(expressID);
	}
}
export class IfcPermeableCoveringProperties extends IfcPropertySetDefinition {
	expressID:number=3566463478;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public OperationType: IfcPermeableCoveringOperationEnum , public PanelPosition: IfcWindowPanelPositionEnum , public FrameDepth: IfcPositiveLengthMeasure | null, public FrameThickness: IfcPositiveLengthMeasure | null, public ShapeAspectStyle: (Reference<IfcShapeAspect> | IfcShapeAspect) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcPlanarBox extends IfcPlanarExtent {
	expressID:number=603570806;
	constructor(expressID: number, public SizeInX: IfcLengthMeasure , public SizeInY: IfcLengthMeasure , public Placement: IfcAxis2Placement )
	{
		super(expressID,SizeInX, SizeInY);
	}
}
export class IfcPlane extends IfcElementarySurface {
	expressID:number=220341763;
	constructor(expressID: number, public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) )
	{
		super(expressID,Position);
	}
}
export class IfcProcess extends IfcObject {
	expressID:number=2945172077;
	OperatesOn!: (Reference<IfcRelAssignsToProcess> | IfcRelAssignsToProcess)[] | null;
	IsSuccessorFrom!: (Reference<IfcRelSequence> | IfcRelSequence)[] | null;
	IsPredecessorTo!: (Reference<IfcRelSequence> | IfcRelSequence)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcProduct extends IfcObject {
	expressID:number=4208778838;
	ReferencedBy!: (Reference<IfcRelAssignsToProduct> | IfcRelAssignsToProduct)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcProject extends IfcObject {
	expressID:number=103090709;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public LongName: IfcLabel | null, public Phase: IfcLabel | null, public RepresentationContexts: (Reference<IfcRepresentationContext> | IfcRepresentationContext)[] , public UnitsInContext: (Reference<IfcUnitAssignment> | IfcUnitAssignment) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcProjectionCurve extends IfcAnnotationCurveOccurrence {
	expressID:number=4194566429;
	constructor(expressID: number, public Item: (Reference<IfcRepresentationItem> | IfcRepresentationItem) | null, public Styles: (Reference<IfcPresentationStyleAssignment> | IfcPresentationStyleAssignment)[] , public Name: IfcLabel | null)
	{
		super(expressID,Item, Styles, Name);
	}
}
export class IfcPropertySet extends IfcPropertySetDefinition {
	expressID:number=1451395588;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public HasProperties: (Reference<IfcProperty> | IfcProperty)[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcProxy extends IfcProduct {
	expressID:number=3219374653;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public ProxyType: IfcObjectTypeEnum , public Tag: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcRectangleHollowProfileDef extends IfcRectangleProfileDef {
	expressID:number=2770003689;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) , public XDim: IfcPositiveLengthMeasure , public YDim: IfcPositiveLengthMeasure , public WallThickness: IfcPositiveLengthMeasure , public InnerFilletRadius: IfcPositiveLengthMeasure | null, public OuterFilletRadius: IfcPositiveLengthMeasure | null)
	{
		super(expressID,ProfileType, ProfileName, Position, XDim, YDim);
	}
}
export class IfcRectangularPyramid extends IfcCsgPrimitive3D {
	expressID:number=2798486643;
	constructor(expressID: number, public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) , public XLength: IfcPositiveLengthMeasure , public YLength: IfcPositiveLengthMeasure , public Height: IfcPositiveLengthMeasure )
	{
		super(expressID,Position);
	}
}
export class IfcRectangularTrimmedSurface extends IfcBoundedSurface {
	expressID:number=3454111270;
	constructor(expressID: number, public BasisSurface: (Reference<IfcSurface> | IfcSurface) , public U1: IfcParameterValue , public V1: IfcParameterValue , public U2: IfcParameterValue , public V2: IfcParameterValue , public Usense: boolean , public Vsense: boolean )
	{
			super(expressID);
	}
}
export class IfcRelAssigns extends IfcRelationship {
	expressID:number=3939117080;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] , public RelatedObjectsType: IfcObjectTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelAssignsToActor extends IfcRelAssigns {
	expressID:number=1683148259;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] , public RelatedObjectsType: IfcObjectTypeEnum | null, public RelatingActor: (Reference<IfcActor> | IfcActor) , public ActingRole: (Reference<IfcActorRole> | IfcActorRole) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects, RelatedObjectsType);
	}
}
export class IfcRelAssignsToControl extends IfcRelAssigns {
	expressID:number=2495723537;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] , public RelatedObjectsType: IfcObjectTypeEnum | null, public RelatingControl: (Reference<IfcControl> | IfcControl) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects, RelatedObjectsType);
	}
}
export class IfcRelAssignsToGroup extends IfcRelAssigns {
	expressID:number=1307041759;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] , public RelatedObjectsType: IfcObjectTypeEnum | null, public RelatingGroup: (Reference<IfcGroup> | IfcGroup) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects, RelatedObjectsType);
	}
}
export class IfcRelAssignsToProcess extends IfcRelAssigns {
	expressID:number=4278684876;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] , public RelatedObjectsType: IfcObjectTypeEnum | null, public RelatingProcess: (Reference<IfcProcess> | IfcProcess) , public QuantityInProcess: (Reference<IfcMeasureWithUnit> | IfcMeasureWithUnit) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects, RelatedObjectsType);
	}
}
export class IfcRelAssignsToProduct extends IfcRelAssigns {
	expressID:number=2857406711;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] , public RelatedObjectsType: IfcObjectTypeEnum | null, public RelatingProduct: (Reference<IfcProduct> | IfcProduct) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects, RelatedObjectsType);
	}
}
export class IfcRelAssignsToProjectOrder extends IfcRelAssignsToControl {
	expressID:number=3372526763;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] , public RelatedObjectsType: IfcObjectTypeEnum | null, public RelatingControl: (Reference<IfcControl> | IfcControl) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects, RelatedObjectsType, RelatingControl);
	}
}
export class IfcRelAssignsToResource extends IfcRelAssigns {
	expressID:number=205026976;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] , public RelatedObjectsType: IfcObjectTypeEnum | null, public RelatingResource: (Reference<IfcResource> | IfcResource) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects, RelatedObjectsType);
	}
}
export class IfcRelAssociates extends IfcRelationship {
	expressID:number=1865459582;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcRoot> | IfcRoot)[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelAssociatesAppliedValue extends IfcRelAssociates {
	expressID:number=1327628568;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcRoot> | IfcRoot)[] , public RelatingAppliedValue: (Reference<IfcAppliedValue> | IfcAppliedValue) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects);
	}
}
export class IfcRelAssociatesApproval extends IfcRelAssociates {
	expressID:number=4095574036;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcRoot> | IfcRoot)[] , public RelatingApproval: (Reference<IfcApproval> | IfcApproval) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects);
	}
}
export class IfcRelAssociatesClassification extends IfcRelAssociates {
	expressID:number=919958153;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcRoot> | IfcRoot)[] , public RelatingClassification: IfcClassificationNotationSelect )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects);
	}
}
export class IfcRelAssociatesConstraint extends IfcRelAssociates {
	expressID:number=2728634034;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcRoot> | IfcRoot)[] , public Intent: IfcLabel , public RelatingConstraint: (Reference<IfcConstraint> | IfcConstraint) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects);
	}
}
export class IfcRelAssociatesDocument extends IfcRelAssociates {
	expressID:number=982818633;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcRoot> | IfcRoot)[] , public RelatingDocument: IfcDocumentSelect )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects);
	}
}
export class IfcRelAssociatesLibrary extends IfcRelAssociates {
	expressID:number=3840914261;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcRoot> | IfcRoot)[] , public RelatingLibrary: IfcLibrarySelect )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects);
	}
}
export class IfcRelAssociatesMaterial extends IfcRelAssociates {
	expressID:number=2655215786;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcRoot> | IfcRoot)[] , public RelatingMaterial: IfcMaterialSelect )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects);
	}
}
export class IfcRelAssociatesProfileProperties extends IfcRelAssociates {
	expressID:number=2851387026;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcRoot> | IfcRoot)[] , public RelatingProfileProperties: (Reference<IfcProfileProperties> | IfcProfileProperties) , public ProfileSectionLocation: (Reference<IfcShapeAspect> | IfcShapeAspect) | null, public ProfileOrientation: IfcOrientationSelect | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects);
	}
}
export class IfcRelConnects extends IfcRelationship {
	expressID:number=826625072;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelConnectsElements extends IfcRelConnects {
	expressID:number=1204542856;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ConnectionGeometry: (Reference<IfcConnectionGeometry> | IfcConnectionGeometry) | null, public RelatingElement: (Reference<IfcElement> | IfcElement) , public RelatedElement: (Reference<IfcElement> | IfcElement) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelConnectsPathElements extends IfcRelConnectsElements {
	expressID:number=3945020480;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ConnectionGeometry: (Reference<IfcConnectionGeometry> | IfcConnectionGeometry) | null, public RelatingElement: (Reference<IfcElement> | IfcElement) , public RelatedElement: (Reference<IfcElement> | IfcElement) , public RelatingPriorities: number[] , public RelatedPriorities: number[] , public RelatedConnectionType: IfcConnectionTypeEnum , public RelatingConnectionType: IfcConnectionTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ConnectionGeometry, RelatingElement, RelatedElement);
	}
}
export class IfcRelConnectsPortToElement extends IfcRelConnects {
	expressID:number=4201705270;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatingPort: (Reference<IfcPort> | IfcPort) , public RelatedElement: (Reference<IfcElement> | IfcElement) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelConnectsPorts extends IfcRelConnects {
	expressID:number=3190031847;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatingPort: (Reference<IfcPort> | IfcPort) , public RelatedPort: (Reference<IfcPort> | IfcPort) , public RealizingElement: (Reference<IfcElement> | IfcElement) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelConnectsStructuralActivity extends IfcRelConnects {
	expressID:number=2127690289;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatingElement: IfcStructuralActivityAssignmentSelect , public RelatedStructuralActivity: (Reference<IfcStructuralActivity> | IfcStructuralActivity) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelConnectsStructuralElement extends IfcRelConnects {
	expressID:number=3912681535;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatingElement: (Reference<IfcElement> | IfcElement) , public RelatedStructuralMember: (Reference<IfcStructuralMember> | IfcStructuralMember) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelConnectsStructuralMember extends IfcRelConnects {
	expressID:number=1638771189;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatingStructuralMember: (Reference<IfcStructuralMember> | IfcStructuralMember) , public RelatedStructuralConnection: (Reference<IfcStructuralConnection> | IfcStructuralConnection) , public AppliedCondition: (Reference<IfcBoundaryCondition> | IfcBoundaryCondition) | null, public AdditionalConditions: (Reference<IfcStructuralConnectionCondition> | IfcStructuralConnectionCondition) | null, public SupportedLength: IfcLengthMeasure | null, public ConditionCoordinateSystem: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelConnectsWithEccentricity extends IfcRelConnectsStructuralMember {
	expressID:number=504942748;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatingStructuralMember: (Reference<IfcStructuralMember> | IfcStructuralMember) , public RelatedStructuralConnection: (Reference<IfcStructuralConnection> | IfcStructuralConnection) , public AppliedCondition: (Reference<IfcBoundaryCondition> | IfcBoundaryCondition) | null, public AdditionalConditions: (Reference<IfcStructuralConnectionCondition> | IfcStructuralConnectionCondition) | null, public SupportedLength: IfcLengthMeasure | null, public ConditionCoordinateSystem: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) | null, public ConnectionConstraint: (Reference<IfcConnectionGeometry> | IfcConnectionGeometry) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatingStructuralMember, RelatedStructuralConnection, AppliedCondition, AdditionalConditions, SupportedLength, ConditionCoordinateSystem);
	}
}
export class IfcRelConnectsWithRealizingElements extends IfcRelConnectsElements {
	expressID:number=3678494232;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ConnectionGeometry: (Reference<IfcConnectionGeometry> | IfcConnectionGeometry) | null, public RelatingElement: (Reference<IfcElement> | IfcElement) , public RelatedElement: (Reference<IfcElement> | IfcElement) , public RealizingElements: (Reference<IfcElement> | IfcElement)[] , public ConnectionType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ConnectionGeometry, RelatingElement, RelatedElement);
	}
}
export class IfcRelContainedInSpatialStructure extends IfcRelConnects {
	expressID:number=3242617779;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedElements: (Reference<IfcProduct> | IfcProduct)[] , public RelatingStructure: (Reference<IfcSpatialStructureElement> | IfcSpatialStructureElement) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelCoversBldgElements extends IfcRelConnects {
	expressID:number=886880790;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatingBuildingElement: (Reference<IfcElement> | IfcElement) , public RelatedCoverings: (Reference<IfcCovering> | IfcCovering)[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelCoversSpaces extends IfcRelConnects {
	expressID:number=2802773753;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedSpace: (Reference<IfcSpace> | IfcSpace) , public RelatedCoverings: (Reference<IfcCovering> | IfcCovering)[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelDecomposes extends IfcRelationship {
	expressID:number=2551354335;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatingObject: (Reference<IfcObjectDefinition> | IfcObjectDefinition) , public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelDefines extends IfcRelationship {
	expressID:number=693640335;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObject> | IfcObject)[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelDefinesByProperties extends IfcRelDefines {
	expressID:number=4186316022;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObject> | IfcObject)[] , public RelatingPropertyDefinition: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects);
	}
}
export class IfcRelDefinesByType extends IfcRelDefines {
	expressID:number=781010003;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObject> | IfcObject)[] , public RelatingType: (Reference<IfcTypeObject> | IfcTypeObject) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects);
	}
}
export class IfcRelFillsElement extends IfcRelConnects {
	expressID:number=3940055652;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatingOpeningElement: (Reference<IfcOpeningElement> | IfcOpeningElement) , public RelatedBuildingElement: (Reference<IfcElement> | IfcElement) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelFlowControlElements extends IfcRelConnects {
	expressID:number=279856033;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedControlElements: (Reference<IfcDistributionControlElement> | IfcDistributionControlElement)[] , public RelatingFlowElement: (Reference<IfcDistributionFlowElement> | IfcDistributionFlowElement) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelInteractionRequirements extends IfcRelConnects {
	expressID:number=4189434867;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public DailyInteraction: IfcCountMeasure | null, public ImportanceRating: IfcNormalisedRatioMeasure | null, public LocationOfInteraction: (Reference<IfcSpatialStructureElement> | IfcSpatialStructureElement) | null, public RelatedSpaceProgram: (Reference<IfcSpaceProgram> | IfcSpaceProgram) , public RelatingSpaceProgram: (Reference<IfcSpaceProgram> | IfcSpaceProgram) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelNests extends IfcRelDecomposes {
	expressID:number=3268803585;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatingObject: (Reference<IfcObjectDefinition> | IfcObjectDefinition) , public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatingObject, RelatedObjects);
	}
}
export class IfcRelOccupiesSpaces extends IfcRelAssignsToActor {
	expressID:number=2051452291;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] , public RelatedObjectsType: IfcObjectTypeEnum | null, public RelatingActor: (Reference<IfcActor> | IfcActor) , public ActingRole: (Reference<IfcActorRole> | IfcActorRole) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects, RelatedObjectsType, RelatingActor, ActingRole);
	}
}
export class IfcRelOverridesProperties extends IfcRelDefinesByProperties {
	expressID:number=202636808;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObject> | IfcObject)[] , public RelatingPropertyDefinition: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition) , public OverridingProperties: (Reference<IfcProperty> | IfcProperty)[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects, RelatingPropertyDefinition);
	}
}
export class IfcRelProjectsElement extends IfcRelConnects {
	expressID:number=750771296;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatingElement: (Reference<IfcElement> | IfcElement) , public RelatedFeatureElement: (Reference<IfcFeatureElementAddition> | IfcFeatureElementAddition) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelReferencedInSpatialStructure extends IfcRelConnects {
	expressID:number=1245217292;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedElements: (Reference<IfcProduct> | IfcProduct)[] , public RelatingStructure: (Reference<IfcSpatialStructureElement> | IfcSpatialStructureElement) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelSchedulesCostItems extends IfcRelAssignsToControl {
	expressID:number=1058617721;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] , public RelatedObjectsType: IfcObjectTypeEnum | null, public RelatingControl: (Reference<IfcControl> | IfcControl) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects, RelatedObjectsType, RelatingControl);
	}
}
export class IfcRelSequence extends IfcRelConnects {
	expressID:number=4122056220;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatingProcess: (Reference<IfcProcess> | IfcProcess) , public RelatedProcess: (Reference<IfcProcess> | IfcProcess) , public TimeLag: IfcTimeMeasure , public SequenceType: IfcSequenceEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelServicesBuildings extends IfcRelConnects {
	expressID:number=366585022;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatingSystem: (Reference<IfcSystem> | IfcSystem) , public RelatedBuildings: (Reference<IfcSpatialStructureElement> | IfcSpatialStructureElement)[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelSpaceBoundary extends IfcRelConnects {
	expressID:number=3451746338;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatingSpace: (Reference<IfcSpace> | IfcSpace) , public RelatedBuildingElement: (Reference<IfcElement> | IfcElement) | null, public ConnectionGeometry: (Reference<IfcConnectionGeometry> | IfcConnectionGeometry) | null, public PhysicalOrVirtualBoundary: IfcPhysicalOrVirtualEnum , public InternalOrExternalBoundary: IfcInternalOrExternalEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelVoidsElement extends IfcRelConnects {
	expressID:number=1401173127;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatingBuildingElement: (Reference<IfcElement> | IfcElement) , public RelatedOpeningElement: (Reference<IfcFeatureElementSubtraction> | IfcFeatureElementSubtraction) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcResource extends IfcObject {
	expressID:number=2914609552;
	ResourceOf!: (Reference<IfcRelAssignsToResource> | IfcRelAssignsToResource)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcRevolvedAreaSolid extends IfcSweptAreaSolid {
	expressID:number=1856042241;
	constructor(expressID: number, public SweptArea: (Reference<IfcProfileDef> | IfcProfileDef) , public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) , public Axis: (Reference<IfcAxis1Placement> | IfcAxis1Placement) , public Angle: IfcPlaneAngleMeasure )
	{
		super(expressID,SweptArea, Position);
	}
}
export class IfcRightCircularCone extends IfcCsgPrimitive3D {
	expressID:number=4158566097;
	constructor(expressID: number, public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) , public Height: IfcPositiveLengthMeasure , public BottomRadius: IfcPositiveLengthMeasure )
	{
		super(expressID,Position);
	}
}
export class IfcRightCircularCylinder extends IfcCsgPrimitive3D {
	expressID:number=3626867408;
	constructor(expressID: number, public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) , public Height: IfcPositiveLengthMeasure , public Radius: IfcPositiveLengthMeasure )
	{
		super(expressID,Position);
	}
}
export class IfcSpatialStructureElement extends IfcProduct {
	expressID:number=2706606064;
	ReferencesElements!: (Reference<IfcRelReferencedInSpatialStructure> | IfcRelReferencedInSpatialStructure)[] | null;
	ServicedBySystems!: (Reference<IfcRelServicesBuildings> | IfcRelServicesBuildings)[] | null;
	ContainsElements!: (Reference<IfcRelContainedInSpatialStructure> | IfcRelContainedInSpatialStructure)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public CompositionType: IfcElementCompositionEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcSpatialStructureElementType extends IfcElementType {
	expressID:number=3893378262;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcSphere extends IfcCsgPrimitive3D {
	expressID:number=451544542;
	constructor(expressID: number, public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) , public Radius: IfcPositiveLengthMeasure )
	{
		super(expressID,Position);
	}
}
export class IfcStructuralActivity extends IfcProduct {
	expressID:number=3544373492;
	AssignedToStructuralItem!: (Reference<IfcRelConnectsStructuralActivity> | IfcRelConnectsStructuralActivity) | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedLoad: (Reference<IfcStructuralLoad> | IfcStructuralLoad) , public GlobalOrLocal: IfcGlobalOrLocalEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcStructuralItem extends IfcProduct {
	expressID:number=3136571912;
	AssignedStructuralActivity!: (Reference<IfcRelConnectsStructuralActivity> | IfcRelConnectsStructuralActivity)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcStructuralMember extends IfcStructuralItem {
	expressID:number=530289379;
	ReferencesElement!: (Reference<IfcRelConnectsStructuralElement> | IfcRelConnectsStructuralElement)[] | null;
	ConnectedBy!: (Reference<IfcRelConnectsStructuralMember> | IfcRelConnectsStructuralMember)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcStructuralReaction extends IfcStructuralActivity {
	expressID:number=3689010777;
	Causes!: (Reference<IfcStructuralAction> | IfcStructuralAction)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedLoad: (Reference<IfcStructuralLoad> | IfcStructuralLoad) , public GlobalOrLocal: IfcGlobalOrLocalEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, AppliedLoad, GlobalOrLocal);
	}
}
export class IfcStructuralSurfaceMember extends IfcStructuralMember {
	expressID:number=3979015343;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public PredefinedType: IfcStructuralSurfaceTypeEnum , public Thickness: IfcPositiveLengthMeasure | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcStructuralSurfaceMemberVarying extends IfcStructuralSurfaceMember {
	expressID:number=2218152070;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public PredefinedType: IfcStructuralSurfaceTypeEnum , public Thickness: IfcPositiveLengthMeasure | null, public SubsequentThickness: IfcPositiveLengthMeasure[] , public VaryingThicknessLocation: (Reference<IfcShapeAspect> | IfcShapeAspect) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, PredefinedType, Thickness);
	}
}
export class IfcStructuredDimensionCallout extends IfcDraughtingCallout {
	expressID:number=4070609034;
	constructor(expressID: number, public Contents: IfcDraughtingCalloutElement[] )
	{
		super(expressID,Contents);
	}
}
export class IfcSurfaceCurveSweptAreaSolid extends IfcSweptAreaSolid {
	expressID:number=2028607225;
	constructor(expressID: number, public SweptArea: (Reference<IfcProfileDef> | IfcProfileDef) , public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) , public Directrix: (Reference<IfcCurve> | IfcCurve) , public StartParam: IfcParameterValue , public EndParam: IfcParameterValue , public ReferenceSurface: (Reference<IfcSurface> | IfcSurface) )
	{
		super(expressID,SweptArea, Position);
	}
}
export class IfcSurfaceOfLinearExtrusion extends IfcSweptSurface {
	expressID:number=2809605785;
	constructor(expressID: number, public SweptCurve: (Reference<IfcProfileDef> | IfcProfileDef) , public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) , public ExtrudedDirection: (Reference<IfcDirection> | IfcDirection) , public Depth: IfcLengthMeasure )
	{
		super(expressID,SweptCurve, Position);
	}
}
export class IfcSurfaceOfRevolution extends IfcSweptSurface {
	expressID:number=4124788165;
	constructor(expressID: number, public SweptCurve: (Reference<IfcProfileDef> | IfcProfileDef) , public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) , public AxisPosition: (Reference<IfcAxis1Placement> | IfcAxis1Placement) )
	{
		super(expressID,SweptCurve, Position);
	}
}
export class IfcSystemFurnitureElementType extends IfcFurnishingElementType {
	expressID:number=1580310250;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcTask extends IfcProcess {
	expressID:number=3473067441;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public TaskId: IfcIdentifier , public Status: IfcLabel | null, public WorkMethod: IfcLabel | null, public IsMilestone: boolean , public Priority: number | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcTransportElementType extends IfcElementType {
	expressID:number=2097647324;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcTransportElementTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcActor extends IfcObject {
	expressID:number=2296667514;
	IsActingUpon!: (Reference<IfcRelAssignsToActor> | IfcRelAssignsToActor)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public TheActor: IfcActorSelect )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcAnnotation extends IfcProduct {
	expressID:number=1674181508;
	ContainedInStructure!: (Reference<IfcRelContainedInSpatialStructure> | IfcRelContainedInSpatialStructure)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcAsymmetricIShapeProfileDef extends IfcIShapeProfileDef {
	expressID:number=3207858831;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) , public OverallWidth: IfcPositiveLengthMeasure , public OverallDepth: IfcPositiveLengthMeasure , public WebThickness: IfcPositiveLengthMeasure , public FlangeThickness: IfcPositiveLengthMeasure , public FilletRadius: IfcPositiveLengthMeasure | null, public TopFlangeWidth: IfcPositiveLengthMeasure , public TopFlangeThickness: IfcPositiveLengthMeasure | null, public TopFlangeFilletRadius: IfcPositiveLengthMeasure | null, public CentreOfGravityInY: IfcPositiveLengthMeasure | null)
	{
		super(expressID,ProfileType, ProfileName, Position, OverallWidth, OverallDepth, WebThickness, FlangeThickness, FilletRadius);
	}
}
export class IfcBlock extends IfcCsgPrimitive3D {
	expressID:number=1334484129;
	constructor(expressID: number, public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) , public XLength: IfcPositiveLengthMeasure , public YLength: IfcPositiveLengthMeasure , public ZLength: IfcPositiveLengthMeasure )
	{
		super(expressID,Position);
	}
}
export class IfcBooleanClippingResult extends IfcBooleanResult {
	expressID:number=3649129432;
	constructor(expressID: number, public Operator: IfcBooleanOperator , public FirstOperand: IfcBooleanOperand , public SecondOperand: IfcBooleanOperand )
	{
		super(expressID,Operator, FirstOperand, SecondOperand);
	}
}
export class IfcBoundedCurve extends IfcCurve {
	expressID:number=1260505505;
	constructor(expressID: number, )
	{
			super(expressID);
	}
}
export class IfcBuilding extends IfcSpatialStructureElement {
	expressID:number=4031249490;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public CompositionType: IfcElementCompositionEnum , public ElevationOfRefHeight: IfcLengthMeasure | null, public ElevationOfTerrain: IfcLengthMeasure | null, public BuildingAddress: (Reference<IfcPostalAddress> | IfcPostalAddress) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName, CompositionType);
	}
}
export class IfcBuildingElementType extends IfcElementType {
	expressID:number=1950629157;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcBuildingStorey extends IfcSpatialStructureElement {
	expressID:number=3124254112;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public CompositionType: IfcElementCompositionEnum , public Elevation: IfcLengthMeasure | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName, CompositionType);
	}
}
export class IfcCircleHollowProfileDef extends IfcCircleProfileDef {
	expressID:number=2937912522;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) , public Radius: IfcPositiveLengthMeasure , public WallThickness: IfcPositiveLengthMeasure )
	{
		super(expressID,ProfileType, ProfileName, Position, Radius);
	}
}
export class IfcColumnType extends IfcBuildingElementType {
	expressID:number=300633059;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcColumnTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcCompositeCurve extends IfcBoundedCurve {
	expressID:number=3732776249;
	constructor(expressID: number, public Segments: (Reference<IfcCompositeCurveSegment> | IfcCompositeCurveSegment)[] , public SelfIntersect: boolean )
	{
			super(expressID);
	}
}
export class IfcConic extends IfcCurve {
	expressID:number=2510884976;
	constructor(expressID: number, public Position: IfcAxis2Placement )
	{
			super(expressID);
	}
}
export class IfcConstructionResource extends IfcResource {
	expressID:number=2559216714;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ResourceIdentifier: IfcIdentifier | null, public ResourceGroup: IfcLabel | null, public ResourceConsumption: IfcResourceConsumptionEnum | null, public BaseQuantity: (Reference<IfcMeasureWithUnit> | IfcMeasureWithUnit) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcControl extends IfcObject {
	expressID:number=3293443760;
	Controls!: (Reference<IfcRelAssignsToControl> | IfcRelAssignsToControl)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcCostItem extends IfcControl {
	expressID:number=3895139033;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcCostSchedule extends IfcControl {
	expressID:number=1419761937;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public SubmittedBy: IfcActorSelect | null, public PreparedBy: IfcActorSelect | null, public SubmittedOn: IfcDateTimeSelect | null, public Status: IfcLabel | null, public TargetUsers: IfcActorSelect[] | null, public UpdateDate: IfcDateTimeSelect | null, public ID: IfcIdentifier , public PredefinedType: IfcCostScheduleTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcCoveringType extends IfcBuildingElementType {
	expressID:number=1916426348;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcCoveringTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcCrewResource extends IfcConstructionResource {
	expressID:number=3295246426;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ResourceIdentifier: IfcIdentifier | null, public ResourceGroup: IfcLabel | null, public ResourceConsumption: IfcResourceConsumptionEnum | null, public BaseQuantity: (Reference<IfcMeasureWithUnit> | IfcMeasureWithUnit) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ResourceIdentifier, ResourceGroup, ResourceConsumption, BaseQuantity);
	}
}
export class IfcCurtainWallType extends IfcBuildingElementType {
	expressID:number=1457835157;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcCurtainWallTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcDimensionCurveDirectedCallout extends IfcDraughtingCallout {
	expressID:number=681481545;
	constructor(expressID: number, public Contents: IfcDraughtingCalloutElement[] )
	{
		super(expressID,Contents);
	}
}
export class IfcDistributionElementType extends IfcElementType {
	expressID:number=3256556792;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcDistributionFlowElementType extends IfcDistributionElementType {
	expressID:number=3849074793;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcElectricalBaseProperties extends IfcEnergyProperties {
	expressID:number=360485395;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public EnergySequence: IfcEnergySequenceEnum | null, public UserDefinedEnergySequence: IfcLabel | null, public ElectricCurrentType: IfcElectricCurrentEnum | null, public InputVoltage: IfcElectricVoltageMeasure , public InputFrequency: IfcFrequencyMeasure , public FullLoadCurrent: IfcElectricCurrentMeasure | null, public MinimumCircuitCurrent: IfcElectricCurrentMeasure | null, public MaximumPowerInput: IfcPowerMeasure | null, public RatedPowerInput: IfcPowerMeasure | null, public InputPhase: number )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, EnergySequence, UserDefinedEnergySequence);
	}
}
export class IfcElement extends IfcProduct {
	expressID:number=1758889154;
	HasStructuralMember!: (Reference<IfcRelConnectsStructuralElement> | IfcRelConnectsStructuralElement)[] | null;
	FillsVoids!: (Reference<IfcRelFillsElement> | IfcRelFillsElement)[] | null;
	ConnectedTo!: (Reference<IfcRelConnectsElements> | IfcRelConnectsElements)[] | null;
	HasCoverings!: (Reference<IfcRelCoversBldgElements> | IfcRelCoversBldgElements)[] | null;
	HasProjections!: (Reference<IfcRelProjectsElement> | IfcRelProjectsElement)[] | null;
	ReferencedInStructures!: (Reference<IfcRelReferencedInSpatialStructure> | IfcRelReferencedInSpatialStructure)[] | null;
	HasPorts!: (Reference<IfcRelConnectsPortToElement> | IfcRelConnectsPortToElement)[] | null;
	HasOpenings!: (Reference<IfcRelVoidsElement> | IfcRelVoidsElement)[] | null;
	IsConnectionRealization!: (Reference<IfcRelConnectsWithRealizingElements> | IfcRelConnectsWithRealizingElements)[] | null;
	ProvidesBoundaries!: (Reference<IfcRelSpaceBoundary> | IfcRelSpaceBoundary)[] | null;
	ConnectedFrom!: (Reference<IfcRelConnectsElements> | IfcRelConnectsElements)[] | null;
	ContainedInStructure!: (Reference<IfcRelContainedInSpatialStructure> | IfcRelContainedInSpatialStructure)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcElementAssembly extends IfcElement {
	expressID:number=4123344466;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public AssemblyPlace: IfcAssemblyPlaceEnum | null, public PredefinedType: IfcElementAssemblyTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcElementComponent extends IfcElement {
	expressID:number=1623761950;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcElementComponentType extends IfcElementType {
	expressID:number=2590856083;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcEllipse extends IfcConic {
	expressID:number=1704287377;
	constructor(expressID: number, public Position: IfcAxis2Placement , public SemiAxis1: IfcPositiveLengthMeasure , public SemiAxis2: IfcPositiveLengthMeasure )
	{
		super(expressID,Position);
	}
}
export class IfcEnergyConversionDeviceType extends IfcDistributionFlowElementType {
	expressID:number=2107101300;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcEquipmentElement extends IfcElement {
	expressID:number=1962604670;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcEquipmentStandard extends IfcControl {
	expressID:number=3272907226;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcEvaporativeCoolerType extends IfcEnergyConversionDeviceType {
	expressID:number=3174744832;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcEvaporativeCoolerTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcEvaporatorType extends IfcEnergyConversionDeviceType {
	expressID:number=3390157468;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcEvaporatorTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFacetedBrep extends IfcManifoldSolidBrep {
	expressID:number=807026263;
	constructor(expressID: number, public Outer: (Reference<IfcClosedShell> | IfcClosedShell) )
	{
		super(expressID,Outer);
	}
}
export class IfcFacetedBrepWithVoids extends IfcManifoldSolidBrep {
	expressID:number=3737207727;
	constructor(expressID: number, public Outer: (Reference<IfcClosedShell> | IfcClosedShell) , public Voids: (Reference<IfcClosedShell> | IfcClosedShell)[] )
	{
		super(expressID,Outer);
	}
}
export class IfcFastener extends IfcElementComponent {
	expressID:number=647756555;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFastenerType extends IfcElementComponentType {
	expressID:number=2489546625;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFeatureElement extends IfcElement {
	expressID:number=2827207264;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFeatureElementAddition extends IfcFeatureElement {
	expressID:number=2143335405;
	ProjectsElements!: (Reference<IfcRelProjectsElement> | IfcRelProjectsElement) | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFeatureElementSubtraction extends IfcFeatureElement {
	expressID:number=1287392070;
	VoidsElements!: (Reference<IfcRelVoidsElement> | IfcRelVoidsElement) | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFlowControllerType extends IfcDistributionFlowElementType {
	expressID:number=3907093117;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFlowFittingType extends IfcDistributionFlowElementType {
	expressID:number=3198132628;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFlowMeterType extends IfcFlowControllerType {
	expressID:number=3815607619;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcFlowMeterTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFlowMovingDeviceType extends IfcDistributionFlowElementType {
	expressID:number=1482959167;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFlowSegmentType extends IfcDistributionFlowElementType {
	expressID:number=1834744321;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFlowStorageDeviceType extends IfcDistributionFlowElementType {
	expressID:number=1339347760;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFlowTerminalType extends IfcDistributionFlowElementType {
	expressID:number=2297155007;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFlowTreatmentDeviceType extends IfcDistributionFlowElementType {
	expressID:number=3009222698;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFurnishingElement extends IfcElement {
	expressID:number=263784265;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFurnitureStandard extends IfcControl {
	expressID:number=814719939;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcGasTerminalType extends IfcFlowTerminalType {
	expressID:number=200128114;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcGasTerminalTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcGrid extends IfcProduct {
	expressID:number=3009204131;
	ContainedInStructure!: (Reference<IfcRelContainedInSpatialStructure> | IfcRelContainedInSpatialStructure)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public UAxes: (Reference<IfcGridAxis> | IfcGridAxis)[] , public VAxes: (Reference<IfcGridAxis> | IfcGridAxis)[] , public WAxes: (Reference<IfcGridAxis> | IfcGridAxis)[] | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcGroup extends IfcObject {
	expressID:number=2706460486;
	IsGroupedBy!: (Reference<IfcRelAssignsToGroup> | IfcRelAssignsToGroup) | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcHeatExchangerType extends IfcEnergyConversionDeviceType {
	expressID:number=1251058090;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcHeatExchangerTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcHumidifierType extends IfcEnergyConversionDeviceType {
	expressID:number=1806887404;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcHumidifierTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcInventory extends IfcGroup {
	expressID:number=2391368822;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public InventoryType: IfcInventoryTypeEnum , public Jurisdiction: IfcActorSelect , public ResponsiblePersons: (Reference<IfcPerson> | IfcPerson)[] , public LastUpdateDate: (Reference<IfcCalendarDate> | IfcCalendarDate) , public CurrentValue: (Reference<IfcCostValue> | IfcCostValue) | null, public OriginalValue: (Reference<IfcCostValue> | IfcCostValue) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcJunctionBoxType extends IfcFlowFittingType {
	expressID:number=4288270099;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcJunctionBoxTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcLaborResource extends IfcConstructionResource {
	expressID:number=3827777499;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ResourceIdentifier: IfcIdentifier | null, public ResourceGroup: IfcLabel | null, public ResourceConsumption: IfcResourceConsumptionEnum | null, public BaseQuantity: (Reference<IfcMeasureWithUnit> | IfcMeasureWithUnit) | null, public SkillSet: IfcText | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ResourceIdentifier, ResourceGroup, ResourceConsumption, BaseQuantity);
	}
}
export class IfcLampType extends IfcFlowTerminalType {
	expressID:number=1051575348;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcLampTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcLightFixtureType extends IfcFlowTerminalType {
	expressID:number=1161773419;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcLightFixtureTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcLinearDimension extends IfcDimensionCurveDirectedCallout {
	expressID:number=2506943328;
	constructor(expressID: number, public Contents: IfcDraughtingCalloutElement[] )
	{
		super(expressID,Contents);
	}
}
export class IfcMechanicalFastener extends IfcFastener {
	expressID:number=377706215;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public NominalDiameter: IfcPositiveLengthMeasure | null, public NominalLength: IfcPositiveLengthMeasure | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcMechanicalFastenerType extends IfcFastenerType {
	expressID:number=2108223431;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcMemberType extends IfcBuildingElementType {
	expressID:number=3181161470;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcMemberTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcMotorConnectionType extends IfcEnergyConversionDeviceType {
	expressID:number=977012517;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcMotorConnectionTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcMove extends IfcTask {
	expressID:number=1916936684;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public TaskId: IfcIdentifier , public Status: IfcLabel | null, public WorkMethod: IfcLabel | null, public IsMilestone: boolean , public Priority: number | null, public MoveFrom: (Reference<IfcSpatialStructureElement> | IfcSpatialStructureElement) , public MoveTo: (Reference<IfcSpatialStructureElement> | IfcSpatialStructureElement) , public PunchList: IfcText[] | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, TaskId, Status, WorkMethod, IsMilestone, Priority);
	}
}
export class IfcOccupant extends IfcActor {
	expressID:number=4143007308;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public TheActor: IfcActorSelect , public PredefinedType: IfcOccupantTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, TheActor);
	}
}
export class IfcOpeningElement extends IfcFeatureElementSubtraction {
	expressID:number=3588315303;
	HasFillings!: (Reference<IfcRelFillsElement> | IfcRelFillsElement)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcOrderAction extends IfcTask {
	expressID:number=3425660407;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public TaskId: IfcIdentifier , public Status: IfcLabel | null, public WorkMethod: IfcLabel | null, public IsMilestone: boolean , public Priority: number | null, public ActionID: IfcIdentifier )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, TaskId, Status, WorkMethod, IsMilestone, Priority);
	}
}
export class IfcOutletType extends IfcFlowTerminalType {
	expressID:number=2837617999;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcOutletTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcPerformanceHistory extends IfcControl {
	expressID:number=2382730787;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public LifeCyclePhase: IfcLabel )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcPermit extends IfcControl {
	expressID:number=3327091369;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public PermitID: IfcIdentifier )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcPipeFittingType extends IfcFlowFittingType {
	expressID:number=804291784;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcPipeFittingTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcPipeSegmentType extends IfcFlowSegmentType {
	expressID:number=4231323485;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcPipeSegmentTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcPlateType extends IfcBuildingElementType {
	expressID:number=4017108033;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcPlateTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcPolyline extends IfcBoundedCurve {
	expressID:number=3724593414;
	constructor(expressID: number, public Points: (Reference<IfcCartesianPoint> | IfcCartesianPoint)[] )
	{
			super(expressID);
	}
}
export class IfcPort extends IfcProduct {
	expressID:number=3740093272;
	ContainedIn!: (Reference<IfcRelConnectsPortToElement> | IfcRelConnectsPortToElement) | null;
	ConnectedFrom!: (Reference<IfcRelConnectsPorts> | IfcRelConnectsPorts)[] | null;
	ConnectedTo!: (Reference<IfcRelConnectsPorts> | IfcRelConnectsPorts)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcProcedure extends IfcProcess {
	expressID:number=2744685151;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ProcedureID: IfcIdentifier , public ProcedureType: IfcProcedureTypeEnum , public UserDefinedProcedureType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcProjectOrder extends IfcControl {
	expressID:number=2904328755;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ID: IfcIdentifier , public PredefinedType: IfcProjectOrderTypeEnum , public Status: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcProjectOrderRecord extends IfcControl {
	expressID:number=3642467123;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Records: (Reference<IfcRelAssignsToProjectOrder> | IfcRelAssignsToProjectOrder)[] , public PredefinedType: IfcProjectOrderRecordTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcProjectionElement extends IfcFeatureElementAddition {
	expressID:number=3651124850;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcProtectiveDeviceType extends IfcFlowControllerType {
	expressID:number=1842657554;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcProtectiveDeviceTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcPumpType extends IfcFlowMovingDeviceType {
	expressID:number=2250791053;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcPumpTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcRadiusDimension extends IfcDimensionCurveDirectedCallout {
	expressID:number=3248260540;
	constructor(expressID: number, public Contents: IfcDraughtingCalloutElement[] )
	{
		super(expressID,Contents);
	}
}
export class IfcRailingType extends IfcBuildingElementType {
	expressID:number=2893384427;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcRailingTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcRampFlightType extends IfcBuildingElementType {
	expressID:number=2324767716;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcRampFlightTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcRelAggregates extends IfcRelDecomposes {
	expressID:number=160246688;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatingObject: (Reference<IfcObjectDefinition> | IfcObjectDefinition) , public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatingObject, RelatedObjects);
	}
}
export class IfcRelAssignsTasks extends IfcRelAssignsToControl {
	expressID:number=2863920197;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] , public RelatedObjectsType: IfcObjectTypeEnum | null, public RelatingControl: (Reference<IfcControl> | IfcControl) , public TimeForTask: (Reference<IfcScheduleTimeControl> | IfcScheduleTimeControl) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects, RelatedObjectsType, RelatingControl);
	}
}
export class IfcSanitaryTerminalType extends IfcFlowTerminalType {
	expressID:number=1768891740;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcSanitaryTerminalTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcScheduleTimeControl extends IfcControl {
	expressID:number=3517283431;
	ScheduleTimeControlAssigned!: (Reference<IfcRelAssignsTasks> | IfcRelAssignsTasks) | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ActualStart: IfcDateTimeSelect | null, public EarlyStart: IfcDateTimeSelect | null, public LateStart: IfcDateTimeSelect | null, public ScheduleStart: IfcDateTimeSelect | null, public ActualFinish: IfcDateTimeSelect | null, public EarlyFinish: IfcDateTimeSelect | null, public LateFinish: IfcDateTimeSelect | null, public ScheduleFinish: IfcDateTimeSelect | null, public ScheduleDuration: IfcTimeMeasure | null, public ActualDuration: IfcTimeMeasure | null, public RemainingTime: IfcTimeMeasure | null, public FreeFloat: IfcTimeMeasure | null, public TotalFloat: IfcTimeMeasure | null, public IsCritical: boolean | null, public StatusTime: IfcDateTimeSelect | null, public StartFloat: IfcTimeMeasure | null, public FinishFloat: IfcTimeMeasure | null, public Completion: IfcPositiveRatioMeasure | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcServiceLife extends IfcControl {
	expressID:number=4105383287;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ServiceLifeType: IfcServiceLifeTypeEnum , public ServiceLifeDuration: IfcTimeMeasure )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcSite extends IfcSpatialStructureElement {
	expressID:number=4097777520;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public CompositionType: IfcElementCompositionEnum , public RefLatitude: IfcCompoundPlaneAngleMeasure | null, public RefLongitude: IfcCompoundPlaneAngleMeasure | null, public RefElevation: IfcLengthMeasure | null, public LandTitleNumber: IfcLabel | null, public SiteAddress: (Reference<IfcPostalAddress> | IfcPostalAddress) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName, CompositionType);
	}
}
export class IfcSlabType extends IfcBuildingElementType {
	expressID:number=2533589738;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcSlabTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcSpace extends IfcSpatialStructureElement {
	expressID:number=3856911033;
	HasCoverings!: (Reference<IfcRelCoversSpaces> | IfcRelCoversSpaces)[] | null;
	BoundedBy!: (Reference<IfcRelSpaceBoundary> | IfcRelSpaceBoundary)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public CompositionType: IfcElementCompositionEnum , public InteriorOrExteriorSpace: IfcInternalOrExternalEnum , public ElevationWithFlooring: IfcLengthMeasure | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName, CompositionType);
	}
}
export class IfcSpaceHeaterType extends IfcEnergyConversionDeviceType {
	expressID:number=1305183839;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcSpaceHeaterTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcSpaceProgram extends IfcControl {
	expressID:number=652456506;
	HasInteractionReqsFrom!: (Reference<IfcRelInteractionRequirements> | IfcRelInteractionRequirements)[] | null;
	HasInteractionReqsTo!: (Reference<IfcRelInteractionRequirements> | IfcRelInteractionRequirements)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public SpaceProgramIdentifier: IfcIdentifier , public MaxRequiredArea: IfcAreaMeasure | null, public MinRequiredArea: IfcAreaMeasure | null, public RequestedLocation: (Reference<IfcSpatialStructureElement> | IfcSpatialStructureElement) | null, public StandardRequiredArea: IfcAreaMeasure )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcSpaceType extends IfcSpatialStructureElementType {
	expressID:number=3812236995;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcSpaceTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcStackTerminalType extends IfcFlowTerminalType {
	expressID:number=3112655638;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcStackTerminalTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcStairFlightType extends IfcBuildingElementType {
	expressID:number=1039846685;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcStairFlightTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcStructuralAction extends IfcStructuralActivity {
	expressID:number=682877961;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedLoad: (Reference<IfcStructuralLoad> | IfcStructuralLoad) , public GlobalOrLocal: IfcGlobalOrLocalEnum , public DestabilizingLoad: boolean , public CausedBy: (Reference<IfcStructuralReaction> | IfcStructuralReaction) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, AppliedLoad, GlobalOrLocal);
	}
}
export class IfcStructuralConnection extends IfcStructuralItem {
	expressID:number=1179482911;
	ConnectsStructuralMembers!: (Reference<IfcRelConnectsStructuralMember> | IfcRelConnectsStructuralMember)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedCondition: (Reference<IfcBoundaryCondition> | IfcBoundaryCondition) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcStructuralCurveConnection extends IfcStructuralConnection {
	expressID:number=4243806635;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedCondition: (Reference<IfcBoundaryCondition> | IfcBoundaryCondition) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, AppliedCondition);
	}
}
export class IfcStructuralCurveMember extends IfcStructuralMember {
	expressID:number=214636428;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public PredefinedType: IfcStructuralCurveTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcStructuralCurveMemberVarying extends IfcStructuralCurveMember {
	expressID:number=2445595289;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public PredefinedType: IfcStructuralCurveTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, PredefinedType);
	}
}
export class IfcStructuralLinearAction extends IfcStructuralAction {
	expressID:number=1807405624;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedLoad: (Reference<IfcStructuralLoad> | IfcStructuralLoad) , public GlobalOrLocal: IfcGlobalOrLocalEnum , public DestabilizingLoad: boolean , public CausedBy: (Reference<IfcStructuralReaction> | IfcStructuralReaction) | null, public ProjectedOrTrue: IfcProjectedOrTrueLengthEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, AppliedLoad, GlobalOrLocal, DestabilizingLoad, CausedBy);
	}
}
export class IfcStructuralLinearActionVarying extends IfcStructuralLinearAction {
	expressID:number=1721250024;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedLoad: (Reference<IfcStructuralLoad> | IfcStructuralLoad) , public GlobalOrLocal: IfcGlobalOrLocalEnum , public DestabilizingLoad: boolean , public CausedBy: (Reference<IfcStructuralReaction> | IfcStructuralReaction) | null, public ProjectedOrTrue: IfcProjectedOrTrueLengthEnum , public VaryingAppliedLoadLocation: (Reference<IfcShapeAspect> | IfcShapeAspect) , public SubsequentAppliedLoads: (Reference<IfcStructuralLoad> | IfcStructuralLoad)[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, AppliedLoad, GlobalOrLocal, DestabilizingLoad, CausedBy, ProjectedOrTrue);
	}
}
export class IfcStructuralLoadGroup extends IfcGroup {
	expressID:number=1252848954;
	SourceOfResultGroup!: (Reference<IfcStructuralResultGroup> | IfcStructuralResultGroup)[] | null;
	LoadGroupFor!: (Reference<IfcStructuralAnalysisModel> | IfcStructuralAnalysisModel)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public PredefinedType: IfcLoadGroupTypeEnum , public ActionType: IfcActionTypeEnum , public ActionSource: IfcActionSourceTypeEnum , public Coefficient: IfcRatioMeasure | null, public Purpose: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcStructuralPlanarAction extends IfcStructuralAction {
	expressID:number=1621171031;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedLoad: (Reference<IfcStructuralLoad> | IfcStructuralLoad) , public GlobalOrLocal: IfcGlobalOrLocalEnum , public DestabilizingLoad: boolean , public CausedBy: (Reference<IfcStructuralReaction> | IfcStructuralReaction) | null, public ProjectedOrTrue: IfcProjectedOrTrueLengthEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, AppliedLoad, GlobalOrLocal, DestabilizingLoad, CausedBy);
	}
}
export class IfcStructuralPlanarActionVarying extends IfcStructuralPlanarAction {
	expressID:number=3987759626;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedLoad: (Reference<IfcStructuralLoad> | IfcStructuralLoad) , public GlobalOrLocal: IfcGlobalOrLocalEnum , public DestabilizingLoad: boolean , public CausedBy: (Reference<IfcStructuralReaction> | IfcStructuralReaction) | null, public ProjectedOrTrue: IfcProjectedOrTrueLengthEnum , public VaryingAppliedLoadLocation: (Reference<IfcShapeAspect> | IfcShapeAspect) , public SubsequentAppliedLoads: (Reference<IfcStructuralLoad> | IfcStructuralLoad)[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, AppliedLoad, GlobalOrLocal, DestabilizingLoad, CausedBy, ProjectedOrTrue);
	}
}
export class IfcStructuralPointAction extends IfcStructuralAction {
	expressID:number=2082059205;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedLoad: (Reference<IfcStructuralLoad> | IfcStructuralLoad) , public GlobalOrLocal: IfcGlobalOrLocalEnum , public DestabilizingLoad: boolean , public CausedBy: (Reference<IfcStructuralReaction> | IfcStructuralReaction) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, AppliedLoad, GlobalOrLocal, DestabilizingLoad, CausedBy);
	}
}
export class IfcStructuralPointConnection extends IfcStructuralConnection {
	expressID:number=734778138;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedCondition: (Reference<IfcBoundaryCondition> | IfcBoundaryCondition) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, AppliedCondition);
	}
}
export class IfcStructuralPointReaction extends IfcStructuralReaction {
	expressID:number=1235345126;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedLoad: (Reference<IfcStructuralLoad> | IfcStructuralLoad) , public GlobalOrLocal: IfcGlobalOrLocalEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, AppliedLoad, GlobalOrLocal);
	}
}
export class IfcStructuralResultGroup extends IfcGroup {
	expressID:number=2986769608;
	ResultGroupFor!: (Reference<IfcStructuralAnalysisModel> | IfcStructuralAnalysisModel)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public TheoryType: IfcAnalysisTheoryTypeEnum , public ResultForLoadGroup: (Reference<IfcStructuralLoadGroup> | IfcStructuralLoadGroup) | null, public IsLinear: boolean )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcStructuralSurfaceConnection extends IfcStructuralConnection {
	expressID:number=1975003073;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedCondition: (Reference<IfcBoundaryCondition> | IfcBoundaryCondition) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, AppliedCondition);
	}
}
export class IfcSubContractResource extends IfcConstructionResource {
	expressID:number=148013059;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ResourceIdentifier: IfcIdentifier | null, public ResourceGroup: IfcLabel | null, public ResourceConsumption: IfcResourceConsumptionEnum | null, public BaseQuantity: (Reference<IfcMeasureWithUnit> | IfcMeasureWithUnit) | null, public SubContractor: IfcActorSelect | null, public JobDescription: IfcText | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ResourceIdentifier, ResourceGroup, ResourceConsumption, BaseQuantity);
	}
}
export class IfcSwitchingDeviceType extends IfcFlowControllerType {
	expressID:number=2315554128;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcSwitchingDeviceTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcSystem extends IfcGroup {
	expressID:number=2254336722;
	ServicesBuildings!: (Reference<IfcRelServicesBuildings> | IfcRelServicesBuildings)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcTankType extends IfcFlowStorageDeviceType {
	expressID:number=5716631;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcTankTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcTimeSeriesSchedule extends IfcControl {
	expressID:number=1637806684;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ApplicableDates: IfcDateTimeSelect[] | null, public TimeSeriesScheduleType: IfcTimeSeriesScheduleTypeEnum , public TimeSeries: (Reference<IfcTimeSeries> | IfcTimeSeries) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcTransformerType extends IfcEnergyConversionDeviceType {
	expressID:number=1692211062;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcTransformerTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcTransportElement extends IfcElement {
	expressID:number=1620046519;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public OperationType: IfcTransportElementTypeEnum | null, public CapacityByWeight: IfcMassMeasure | null, public CapacityByNumber: IfcCountMeasure | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcTrimmedCurve extends IfcBoundedCurve {
	expressID:number=3593883385;
	constructor(expressID: number, public BasisCurve: (Reference<IfcCurve> | IfcCurve) , public Trim1: IfcTrimmingSelect[] , public Trim2: IfcTrimmingSelect[] , public SenseAgreement: boolean , public MasterRepresentation: IfcTrimmingPreference )
	{
			super(expressID);
	}
}
export class IfcTubeBundleType extends IfcEnergyConversionDeviceType {
	expressID:number=1600972822;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcTubeBundleTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcUnitaryEquipmentType extends IfcEnergyConversionDeviceType {
	expressID:number=1911125066;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcUnitaryEquipmentTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcValveType extends IfcFlowControllerType {
	expressID:number=728799441;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcValveTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcVirtualElement extends IfcElement {
	expressID:number=2769231204;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcWallType extends IfcBuildingElementType {
	expressID:number=1898987631;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcWallTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcWasteTerminalType extends IfcFlowTerminalType {
	expressID:number=1133259667;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcWasteTerminalTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcWorkControl extends IfcControl {
	expressID:number=1028945134;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identifier: IfcIdentifier , public CreationDate: IfcDateTimeSelect , public Creators: (Reference<IfcPerson> | IfcPerson)[] | null, public Purpose: IfcLabel | null, public Duration: IfcTimeMeasure | null, public TotalFloat: IfcTimeMeasure | null, public StartTime: IfcDateTimeSelect , public FinishTime: IfcDateTimeSelect | null, public WorkControlType: IfcWorkControlTypeEnum | null, public UserDefinedControlType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcWorkPlan extends IfcWorkControl {
	expressID:number=4218914973;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identifier: IfcIdentifier , public CreationDate: IfcDateTimeSelect , public Creators: (Reference<IfcPerson> | IfcPerson)[] | null, public Purpose: IfcLabel | null, public Duration: IfcTimeMeasure | null, public TotalFloat: IfcTimeMeasure | null, public StartTime: IfcDateTimeSelect , public FinishTime: IfcDateTimeSelect | null, public WorkControlType: IfcWorkControlTypeEnum | null, public UserDefinedControlType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, Identifier, CreationDate, Creators, Purpose, Duration, TotalFloat, StartTime, FinishTime, WorkControlType, UserDefinedControlType);
	}
}
export class IfcWorkSchedule extends IfcWorkControl {
	expressID:number=3342526732;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identifier: IfcIdentifier , public CreationDate: IfcDateTimeSelect , public Creators: (Reference<IfcPerson> | IfcPerson)[] | null, public Purpose: IfcLabel | null, public Duration: IfcTimeMeasure | null, public TotalFloat: IfcTimeMeasure | null, public StartTime: IfcDateTimeSelect , public FinishTime: IfcDateTimeSelect | null, public WorkControlType: IfcWorkControlTypeEnum | null, public UserDefinedControlType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, Identifier, CreationDate, Creators, Purpose, Duration, TotalFloat, StartTime, FinishTime, WorkControlType, UserDefinedControlType);
	}
}
export class IfcZone extends IfcGroup {
	expressID:number=1033361043;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class Ifc2DCompositeCurve extends IfcCompositeCurve {
	expressID:number=1213861670;
	constructor(expressID: number, public Segments: (Reference<IfcCompositeCurveSegment> | IfcCompositeCurveSegment)[] , public SelfIntersect: boolean )
	{
		super(expressID,Segments, SelfIntersect);
	}
}
export class IfcActionRequest extends IfcControl {
	expressID:number=3821786052;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public RequestID: IfcIdentifier )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcAirTerminalBoxType extends IfcFlowControllerType {
	expressID:number=1411407467;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcAirTerminalBoxTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcAirTerminalType extends IfcFlowTerminalType {
	expressID:number=3352864051;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcAirTerminalTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcAirToAirHeatRecoveryType extends IfcEnergyConversionDeviceType {
	expressID:number=1871374353;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcAirToAirHeatRecoveryTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcAngularDimension extends IfcDimensionCurveDirectedCallout {
	expressID:number=2470393545;
	constructor(expressID: number, public Contents: IfcDraughtingCalloutElement[] )
	{
		super(expressID,Contents);
	}
}
export class IfcAsset extends IfcGroup {
	expressID:number=3460190687;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public AssetID: IfcIdentifier , public OriginalValue: (Reference<IfcCostValue> | IfcCostValue) , public CurrentValue: (Reference<IfcCostValue> | IfcCostValue) , public TotalReplacementCost: (Reference<IfcCostValue> | IfcCostValue) , public Owner: IfcActorSelect , public User: IfcActorSelect , public ResponsiblePerson: (Reference<IfcPerson> | IfcPerson) , public IncorporationDate: (Reference<IfcCalendarDate> | IfcCalendarDate) , public DepreciatedValue: (Reference<IfcCostValue> | IfcCostValue) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcBSplineCurve extends IfcBoundedCurve {
	expressID:number=1967976161;
	constructor(expressID: number, public Degree: number , public ControlPointsList: (Reference<IfcCartesianPoint> | IfcCartesianPoint)[] , public CurveForm: IfcBSplineCurveForm , public ClosedCurve: boolean , public SelfIntersect: boolean )
	{
			super(expressID);
	}
}
export class IfcBeamType extends IfcBuildingElementType {
	expressID:number=819618141;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcBeamTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcBezierCurve extends IfcBSplineCurve {
	expressID:number=1916977116;
	constructor(expressID: number, public Degree: number , public ControlPointsList: (Reference<IfcCartesianPoint> | IfcCartesianPoint)[] , public CurveForm: IfcBSplineCurveForm , public ClosedCurve: boolean , public SelfIntersect: boolean )
	{
		super(expressID,Degree, ControlPointsList, CurveForm, ClosedCurve, SelfIntersect);
	}
}
export class IfcBoilerType extends IfcEnergyConversionDeviceType {
	expressID:number=231477066;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcBoilerTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcBuildingElement extends IfcElement {
	expressID:number=3299480353;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcBuildingElementComponent extends IfcBuildingElement {
	expressID:number=52481810;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcBuildingElementPart extends IfcBuildingElementComponent {
	expressID:number=2979338954;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcBuildingElementProxy extends IfcBuildingElement {
	expressID:number=1095909175;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public CompositionType: IfcElementCompositionEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcBuildingElementProxyType extends IfcBuildingElementType {
	expressID:number=1909888760;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcBuildingElementProxyTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcCableCarrierFittingType extends IfcFlowFittingType {
	expressID:number=395041908;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcCableCarrierFittingTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcCableCarrierSegmentType extends IfcFlowSegmentType {
	expressID:number=3293546465;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcCableCarrierSegmentTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcCableSegmentType extends IfcFlowSegmentType {
	expressID:number=1285652485;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcCableSegmentTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcChillerType extends IfcEnergyConversionDeviceType {
	expressID:number=2951183804;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcChillerTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcCircle extends IfcConic {
	expressID:number=2611217952;
	constructor(expressID: number, public Position: IfcAxis2Placement , public Radius: IfcPositiveLengthMeasure )
	{
		super(expressID,Position);
	}
}
export class IfcCoilType extends IfcEnergyConversionDeviceType {
	expressID:number=2301859152;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcCoilTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcColumn extends IfcBuildingElement {
	expressID:number=843113511;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcCompressorType extends IfcFlowMovingDeviceType {
	expressID:number=3850581409;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcCompressorTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcCondenserType extends IfcEnergyConversionDeviceType {
	expressID:number=2816379211;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcCondenserTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcCondition extends IfcGroup {
	expressID:number=2188551683;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcConditionCriterion extends IfcControl {
	expressID:number=1163958913;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Criterion: IfcConditionCriterionSelect , public CriterionDateTime: IfcDateTimeSelect )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcConstructionEquipmentResource extends IfcConstructionResource {
	expressID:number=3898045240;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ResourceIdentifier: IfcIdentifier | null, public ResourceGroup: IfcLabel | null, public ResourceConsumption: IfcResourceConsumptionEnum | null, public BaseQuantity: (Reference<IfcMeasureWithUnit> | IfcMeasureWithUnit) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ResourceIdentifier, ResourceGroup, ResourceConsumption, BaseQuantity);
	}
}
export class IfcConstructionMaterialResource extends IfcConstructionResource {
	expressID:number=1060000209;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ResourceIdentifier: IfcIdentifier | null, public ResourceGroup: IfcLabel | null, public ResourceConsumption: IfcResourceConsumptionEnum | null, public BaseQuantity: (Reference<IfcMeasureWithUnit> | IfcMeasureWithUnit) | null, public Suppliers: IfcActorSelect[] | null, public UsageRatio: IfcRatioMeasure | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ResourceIdentifier, ResourceGroup, ResourceConsumption, BaseQuantity);
	}
}
export class IfcConstructionProductResource extends IfcConstructionResource {
	expressID:number=488727124;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ResourceIdentifier: IfcIdentifier | null, public ResourceGroup: IfcLabel | null, public ResourceConsumption: IfcResourceConsumptionEnum | null, public BaseQuantity: (Reference<IfcMeasureWithUnit> | IfcMeasureWithUnit) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ResourceIdentifier, ResourceGroup, ResourceConsumption, BaseQuantity);
	}
}
export class IfcCooledBeamType extends IfcEnergyConversionDeviceType {
	expressID:number=335055490;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcCooledBeamTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcCoolingTowerType extends IfcEnergyConversionDeviceType {
	expressID:number=2954562838;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcCoolingTowerTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcCovering extends IfcBuildingElement {
	expressID:number=1973544240;
	CoversSpaces!: (Reference<IfcRelCoversSpaces> | IfcRelCoversSpaces)[] | null;
	Covers!: (Reference<IfcRelCoversBldgElements> | IfcRelCoversBldgElements)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcCoveringTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcCurtainWall extends IfcBuildingElement {
	expressID:number=3495092785;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcDamperType extends IfcFlowControllerType {
	expressID:number=3961806047;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcDamperTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcDiameterDimension extends IfcDimensionCurveDirectedCallout {
	expressID:number=4147604152;
	constructor(expressID: number, public Contents: IfcDraughtingCalloutElement[] )
	{
		super(expressID,Contents);
	}
}
export class IfcDiscreteAccessory extends IfcElementComponent {
	expressID:number=1335981549;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcDiscreteAccessoryType extends IfcElementComponentType {
	expressID:number=2635815018;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcDistributionChamberElementType extends IfcDistributionFlowElementType {
	expressID:number=1599208980;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcDistributionChamberElementTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcDistributionControlElementType extends IfcDistributionElementType {
	expressID:number=2063403501;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcDistributionElement extends IfcElement {
	expressID:number=1945004755;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcDistributionFlowElement extends IfcDistributionElement {
	expressID:number=3040386961;
	HasControlElements!: (Reference<IfcRelFlowControlElements> | IfcRelFlowControlElements)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcDistributionPort extends IfcPort {
	expressID:number=3041715199;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public FlowDirection: IfcFlowDirectionEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcDoor extends IfcBuildingElement {
	expressID:number=395920057;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public OverallHeight: IfcPositiveLengthMeasure | null, public OverallWidth: IfcPositiveLengthMeasure | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcDuctFittingType extends IfcFlowFittingType {
	expressID:number=869906466;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcDuctFittingTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcDuctSegmentType extends IfcFlowSegmentType {
	expressID:number=3760055223;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcDuctSegmentTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcDuctSilencerType extends IfcFlowTreatmentDeviceType {
	expressID:number=2030761528;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcDuctSilencerTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcEdgeFeature extends IfcFeatureElementSubtraction {
	expressID:number=855621170;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public FeatureLength: IfcPositiveLengthMeasure | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcElectricApplianceType extends IfcFlowTerminalType {
	expressID:number=663422040;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcElectricApplianceTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcElectricFlowStorageDeviceType extends IfcFlowStorageDeviceType {
	expressID:number=3277789161;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcElectricFlowStorageDeviceTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcElectricGeneratorType extends IfcEnergyConversionDeviceType {
	expressID:number=1534661035;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcElectricGeneratorTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcElectricHeaterType extends IfcFlowTerminalType {
	expressID:number=1365060375;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcElectricHeaterTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcElectricMotorType extends IfcEnergyConversionDeviceType {
	expressID:number=1217240411;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcElectricMotorTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcElectricTimeControlType extends IfcFlowControllerType {
	expressID:number=712377611;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcElectricTimeControlTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcElectricalCircuit extends IfcSystem {
	expressID:number=1634875225;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcElectricalElement extends IfcElement {
	expressID:number=857184966;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcEnergyConversionDevice extends IfcDistributionFlowElement {
	expressID:number=1658829314;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFanType extends IfcFlowMovingDeviceType {
	expressID:number=346874300;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcFanTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFilterType extends IfcFlowTreatmentDeviceType {
	expressID:number=1810631287;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcFilterTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFireSuppressionTerminalType extends IfcFlowTerminalType {
	expressID:number=4222183408;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcFireSuppressionTerminalTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFlowController extends IfcDistributionFlowElement {
	expressID:number=2058353004;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFlowFitting extends IfcDistributionFlowElement {
	expressID:number=4278956645;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFlowInstrumentType extends IfcDistributionControlElementType {
	expressID:number=4037862832;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcFlowInstrumentTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFlowMovingDevice extends IfcDistributionFlowElement {
	expressID:number=3132237377;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFlowSegment extends IfcDistributionFlowElement {
	expressID:number=987401354;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFlowStorageDevice extends IfcDistributionFlowElement {
	expressID:number=707683696;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFlowTerminal extends IfcDistributionFlowElement {
	expressID:number=2223149337;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFlowTreatmentDevice extends IfcDistributionFlowElement {
	expressID:number=3508470533;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFooting extends IfcBuildingElement {
	expressID:number=900683007;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcFootingTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcMember extends IfcBuildingElement {
	expressID:number=1073191201;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcPile extends IfcBuildingElement {
	expressID:number=1687234759;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcPileTypeEnum , public ConstructionType: IfcPileConstructionEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcPlate extends IfcBuildingElement {
	expressID:number=3171933400;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcRailing extends IfcBuildingElement {
	expressID:number=2262370178;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcRailingTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcRamp extends IfcBuildingElement {
	expressID:number=3024970846;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public ShapeType: IfcRampTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcRampFlight extends IfcBuildingElement {
	expressID:number=3283111854;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcRationalBezierCurve extends IfcBezierCurve {
	expressID:number=3055160366;
	constructor(expressID: number, public Degree: number , public ControlPointsList: (Reference<IfcCartesianPoint> | IfcCartesianPoint)[] , public CurveForm: IfcBSplineCurveForm , public ClosedCurve: boolean , public SelfIntersect: boolean , public WeightsData: number[] )
	{
		super(expressID,Degree, ControlPointsList, CurveForm, ClosedCurve, SelfIntersect);
	}
}
export class IfcReinforcingElement extends IfcBuildingElementComponent {
	expressID:number=3027567501;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public SteelGrade: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcReinforcingMesh extends IfcReinforcingElement {
	expressID:number=2320036040;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public SteelGrade: IfcLabel | null, public MeshLength: IfcPositiveLengthMeasure | null, public MeshWidth: IfcPositiveLengthMeasure | null, public LongitudinalBarNominalDiameter: IfcPositiveLengthMeasure , public TransverseBarNominalDiameter: IfcPositiveLengthMeasure , public LongitudinalBarCrossSectionArea: IfcAreaMeasure , public TransverseBarCrossSectionArea: IfcAreaMeasure , public LongitudinalBarSpacing: IfcPositiveLengthMeasure , public TransverseBarSpacing: IfcPositiveLengthMeasure )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag, SteelGrade);
	}
}
export class IfcRoof extends IfcBuildingElement {
	expressID:number=2016517767;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public ShapeType: IfcRoofTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcRoundedEdgeFeature extends IfcEdgeFeature {
	expressID:number=1376911519;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public FeatureLength: IfcPositiveLengthMeasure | null, public Radius: IfcPositiveLengthMeasure | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag, FeatureLength);
	}
}
export class IfcSensorType extends IfcDistributionControlElementType {
	expressID:number=1783015770;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcSensorTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcSlab extends IfcBuildingElement {
	expressID:number=1529196076;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcSlabTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcStair extends IfcBuildingElement {
	expressID:number=331165859;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public ShapeType: IfcStairTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcStairFlight extends IfcBuildingElement {
	expressID:number=4252922144;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public NumberOfRiser: number | null, public NumberOfTreads: number | null, public RiserHeight: IfcPositiveLengthMeasure | null, public TreadLength: IfcPositiveLengthMeasure | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcStructuralAnalysisModel extends IfcSystem {
	expressID:number=2515109513;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public PredefinedType: IfcAnalysisModelTypeEnum , public OrientationOf2DPlane: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) | null, public LoadedBy: (Reference<IfcStructuralLoadGroup> | IfcStructuralLoadGroup)[] | null, public HasResults: (Reference<IfcStructuralResultGroup> | IfcStructuralResultGroup)[] | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcTendon extends IfcReinforcingElement {
	expressID:number=3824725483;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public SteelGrade: IfcLabel | null, public PredefinedType: IfcTendonTypeEnum , public NominalDiameter: IfcPositiveLengthMeasure , public CrossSectionArea: IfcAreaMeasure , public TensionForce: IfcForceMeasure | null, public PreStress: IfcPressureMeasure | null, public FrictionCoefficient: IfcNormalisedRatioMeasure | null, public AnchorageSlip: IfcPositiveLengthMeasure | null, public MinCurvatureRadius: IfcPositiveLengthMeasure | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag, SteelGrade);
	}
}
export class IfcTendonAnchor extends IfcReinforcingElement {
	expressID:number=2347447852;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public SteelGrade: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag, SteelGrade);
	}
}
export class IfcVibrationIsolatorType extends IfcDiscreteAccessoryType {
	expressID:number=3313531582;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcVibrationIsolatorTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcWall extends IfcBuildingElement {
	expressID:number=2391406946;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcWallStandardCase extends IfcWall {
	expressID:number=3512223829;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcWindow extends IfcBuildingElement {
	expressID:number=3304561284;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public OverallHeight: IfcPositiveLengthMeasure | null, public OverallWidth: IfcPositiveLengthMeasure | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcActuatorType extends IfcDistributionControlElementType {
	expressID:number=2874132201;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcActuatorTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcAlarmType extends IfcDistributionControlElementType {
	expressID:number=3001207471;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcAlarmTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcBeam extends IfcBuildingElement {
	expressID:number=753842376;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcChamferEdgeFeature extends IfcEdgeFeature {
	expressID:number=2454782716;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public FeatureLength: IfcPositiveLengthMeasure | null, public Width: IfcPositiveLengthMeasure | null, public Height: IfcPositiveLengthMeasure | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag, FeatureLength);
	}
}
export class IfcControllerType extends IfcDistributionControlElementType {
	expressID:number=578613899;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcLabel | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcControllerTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcDistributionChamberElement extends IfcDistributionFlowElement {
	expressID:number=1052013943;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcDistributionControlElement extends IfcDistributionElement {
	expressID:number=1062813311;
	AssignedToFlowElement!: (Reference<IfcRelFlowControlElements> | IfcRelFlowControlElements)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public ControlElementId: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcElectricDistributionPoint extends IfcFlowController {
	expressID:number=3700593921;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public DistributionPointFunction: IfcElectricDistributionPointFunctionEnum , public UserDefinedFunction: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcReinforcingBar extends IfcReinforcingElement {
	expressID:number=979691226;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) , public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public SteelGrade: IfcLabel | null, public NominalDiameter: IfcPositiveLengthMeasure , public CrossSectionArea: IfcAreaMeasure , public BarLength: IfcPositiveLengthMeasure | null, public BarRole: IfcReinforcingBarRoleEnum , public BarSurface: IfcReinforcingBarSurfaceEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag, SteelGrade);
	}
}