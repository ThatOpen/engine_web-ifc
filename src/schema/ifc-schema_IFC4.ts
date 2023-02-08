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
export class IfcArcIndex {
	constructor(public value: Array<IfcPositiveInteger>) {}
};
export class IfcAreaDensityMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcAreaMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcBinary {
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
export class IfcCardinalPointReference {
	type: number=4;
	constructor(public value: number) {}
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
export class IfcDate {
	type: number=1;
	constructor(public value: string) {}
}
export class IfcDateTime {
	type: number=1;
	constructor(public value: string) {}
}
export class IfcDayInMonthNumber {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcDayInWeekNumber {
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
export class IfcDuration {
	type: number=1;
	constructor(public value: string) {}
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
export class IfcLanguageId {
	type: number=1;
	constructor(public value: string) {}
}
export class IfcLengthMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcLineIndex {
	constructor(public value: Array<IfcPositiveInteger>) {}
};
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
export class IfcNonNegativeLengthMeasure {
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
export class IfcPositiveInteger {
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
export class IfcPropertySetDefinitionSet {
	constructor(public value: Array<IfcPropertySetDefinition>) {}
};
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
export class IfcSoundPowerLevelMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcSoundPowerMeasure {
	type: number=4;
	constructor(public value: number) {}
}
export class IfcSoundPressureLevelMeasure {
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
export class IfcTemperatureRateOfChangeMeasure {
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
export class IfcTime {
	type: number=1;
	constructor(public value: string) {}
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
export class IfcURIReference {
	type: number=1;
	constructor(public value: string) {}
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
export class IfcActionRequestTypeEnum {
	static EMAIL : any =  { type:3, value:'EMAIL'}; static FAX : any =  { type:3, value:'FAX'}; static PHONE : any =  { type:3, value:'PHONE'}; static POST : any =  { type:3, value:'POST'}; static VERBAL : any =  { type:3, value:'VERBAL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
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
export class IfcAirTerminalBoxTypeEnum {
	static CONSTANTFLOW : any =  { type:3, value:'CONSTANTFLOW'}; static VARIABLEFLOWPRESSUREDEPENDANT : any =  { type:3, value:'VARIABLEFLOWPRESSUREDEPENDANT'}; static VARIABLEFLOWPRESSUREINDEPENDANT : any =  { type:3, value:'VARIABLEFLOWPRESSUREINDEPENDANT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcAirTerminalTypeEnum {
	static DIFFUSER : any =  { type:3, value:'DIFFUSER'}; static GRILLE : any =  { type:3, value:'GRILLE'}; static LOUVRE : any =  { type:3, value:'LOUVRE'}; static REGISTER : any =  { type:3, value:'REGISTER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
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
export class IfcAudioVisualApplianceTypeEnum {
	static AMPLIFIER : any =  { type:3, value:'AMPLIFIER'}; static CAMERA : any =  { type:3, value:'CAMERA'}; static DISPLAY : any =  { type:3, value:'DISPLAY'}; static MICROPHONE : any =  { type:3, value:'MICROPHONE'}; static PLAYER : any =  { type:3, value:'PLAYER'}; static PROJECTOR : any =  { type:3, value:'PROJECTOR'}; static RECEIVER : any =  { type:3, value:'RECEIVER'}; static SPEAKER : any =  { type:3, value:'SPEAKER'}; static SWITCHER : any =  { type:3, value:'SWITCHER'}; static TELEPHONE : any =  { type:3, value:'TELEPHONE'}; static TUNER : any =  { type:3, value:'TUNER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcBSplineCurveForm {
	static POLYLINE_FORM : any =  { type:3, value:'POLYLINE_FORM'}; static CIRCULAR_ARC : any =  { type:3, value:'CIRCULAR_ARC'}; static ELLIPTIC_ARC : any =  { type:3, value:'ELLIPTIC_ARC'}; static PARABOLIC_ARC : any =  { type:3, value:'PARABOLIC_ARC'}; static HYPERBOLIC_ARC : any =  { type:3, value:'HYPERBOLIC_ARC'}; static UNSPECIFIED : any =  { type:3, value:'UNSPECIFIED'}; 
}
export class IfcBSplineSurfaceForm {
	static PLANE_SURF : any =  { type:3, value:'PLANE_SURF'}; static CYLINDRICAL_SURF : any =  { type:3, value:'CYLINDRICAL_SURF'}; static CONICAL_SURF : any =  { type:3, value:'CONICAL_SURF'}; static SPHERICAL_SURF : any =  { type:3, value:'SPHERICAL_SURF'}; static TOROIDAL_SURF : any =  { type:3, value:'TOROIDAL_SURF'}; static SURF_OF_REVOLUTION : any =  { type:3, value:'SURF_OF_REVOLUTION'}; static RULED_SURF : any =  { type:3, value:'RULED_SURF'}; static GENERALISED_CONE : any =  { type:3, value:'GENERALISED_CONE'}; static QUADRIC_SURF : any =  { type:3, value:'QUADRIC_SURF'}; static SURF_OF_LINEAR_EXTRUSION : any =  { type:3, value:'SURF_OF_LINEAR_EXTRUSION'}; static UNSPECIFIED : any =  { type:3, value:'UNSPECIFIED'}; 
}
export class IfcBeamTypeEnum {
	static BEAM : any =  { type:3, value:'BEAM'}; static JOIST : any =  { type:3, value:'JOIST'}; static HOLLOWCORE : any =  { type:3, value:'HOLLOWCORE'}; static LINTEL : any =  { type:3, value:'LINTEL'}; static SPANDREL : any =  { type:3, value:'SPANDREL'}; static T_BEAM : any =  { type:3, value:'T_BEAM'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcBenchmarkEnum {
	static GREATERTHAN : any =  { type:3, value:'GREATERTHAN'}; static GREATERTHANOREQUALTO : any =  { type:3, value:'GREATERTHANOREQUALTO'}; static LESSTHAN : any =  { type:3, value:'LESSTHAN'}; static LESSTHANOREQUALTO : any =  { type:3, value:'LESSTHANOREQUALTO'}; static EQUALTO : any =  { type:3, value:'EQUALTO'}; static NOTEQUALTO : any =  { type:3, value:'NOTEQUALTO'}; static INCLUDES : any =  { type:3, value:'INCLUDES'}; static NOTINCLUDES : any =  { type:3, value:'NOTINCLUDES'}; static INCLUDEDIN : any =  { type:3, value:'INCLUDEDIN'}; static NOTINCLUDEDIN : any =  { type:3, value:'NOTINCLUDEDIN'}; 
}
export class IfcBoilerTypeEnum {
	static WATER : any =  { type:3, value:'WATER'}; static STEAM : any =  { type:3, value:'STEAM'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcBooleanOperator {
	static UNION : any =  { type:3, value:'UNION'}; static INTERSECTION : any =  { type:3, value:'INTERSECTION'}; static DIFFERENCE : any =  { type:3, value:'DIFFERENCE'}; 
}
export class IfcBuildingElementPartTypeEnum {
	static INSULATION : any =  { type:3, value:'INSULATION'}; static PRECASTPANEL : any =  { type:3, value:'PRECASTPANEL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcBuildingElementProxyTypeEnum {
	static COMPLEX : any =  { type:3, value:'COMPLEX'}; static ELEMENT : any =  { type:3, value:'ELEMENT'}; static PARTIAL : any =  { type:3, value:'PARTIAL'}; static PROVISIONFORVOID : any =  { type:3, value:'PROVISIONFORVOID'}; static PROVISIONFORSPACE : any =  { type:3, value:'PROVISIONFORSPACE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcBuildingSystemTypeEnum {
	static FENESTRATION : any =  { type:3, value:'FENESTRATION'}; static FOUNDATION : any =  { type:3, value:'FOUNDATION'}; static LOADBEARING : any =  { type:3, value:'LOADBEARING'}; static OUTERSHELL : any =  { type:3, value:'OUTERSHELL'}; static SHADING : any =  { type:3, value:'SHADING'}; static TRANSPORT : any =  { type:3, value:'TRANSPORT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcBurnerTypeEnum {
	static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCableCarrierFittingTypeEnum {
	static BEND : any =  { type:3, value:'BEND'}; static CROSS : any =  { type:3, value:'CROSS'}; static REDUCER : any =  { type:3, value:'REDUCER'}; static TEE : any =  { type:3, value:'TEE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCableCarrierSegmentTypeEnum {
	static CABLELADDERSEGMENT : any =  { type:3, value:'CABLELADDERSEGMENT'}; static CABLETRAYSEGMENT : any =  { type:3, value:'CABLETRAYSEGMENT'}; static CABLETRUNKINGSEGMENT : any =  { type:3, value:'CABLETRUNKINGSEGMENT'}; static CONDUITSEGMENT : any =  { type:3, value:'CONDUITSEGMENT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCableFittingTypeEnum {
	static CONNECTOR : any =  { type:3, value:'CONNECTOR'}; static ENTRY : any =  { type:3, value:'ENTRY'}; static EXIT : any =  { type:3, value:'EXIT'}; static JUNCTION : any =  { type:3, value:'JUNCTION'}; static TRANSITION : any =  { type:3, value:'TRANSITION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCableSegmentTypeEnum {
	static BUSBARSEGMENT : any =  { type:3, value:'BUSBARSEGMENT'}; static CABLESEGMENT : any =  { type:3, value:'CABLESEGMENT'}; static CONDUCTORSEGMENT : any =  { type:3, value:'CONDUCTORSEGMENT'}; static CORESEGMENT : any =  { type:3, value:'CORESEGMENT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcChangeActionEnum {
	static NOCHANGE : any =  { type:3, value:'NOCHANGE'}; static MODIFIED : any =  { type:3, value:'MODIFIED'}; static ADDED : any =  { type:3, value:'ADDED'}; static DELETED : any =  { type:3, value:'DELETED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcChillerTypeEnum {
	static AIRCOOLED : any =  { type:3, value:'AIRCOOLED'}; static WATERCOOLED : any =  { type:3, value:'WATERCOOLED'}; static HEATRECOVERY : any =  { type:3, value:'HEATRECOVERY'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcChimneyTypeEnum {
	static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCoilTypeEnum {
	static DXCOOLINGCOIL : any =  { type:3, value:'DXCOOLINGCOIL'}; static ELECTRICHEATINGCOIL : any =  { type:3, value:'ELECTRICHEATINGCOIL'}; static GASHEATINGCOIL : any =  { type:3, value:'GASHEATINGCOIL'}; static HYDRONICCOIL : any =  { type:3, value:'HYDRONICCOIL'}; static STEAMHEATINGCOIL : any =  { type:3, value:'STEAMHEATINGCOIL'}; static WATERCOOLINGCOIL : any =  { type:3, value:'WATERCOOLINGCOIL'}; static WATERHEATINGCOIL : any =  { type:3, value:'WATERHEATINGCOIL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcColumnTypeEnum {
	static COLUMN : any =  { type:3, value:'COLUMN'}; static PILASTER : any =  { type:3, value:'PILASTER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCommunicationsApplianceTypeEnum {
	static ANTENNA : any =  { type:3, value:'ANTENNA'}; static COMPUTER : any =  { type:3, value:'COMPUTER'}; static FAX : any =  { type:3, value:'FAX'}; static GATEWAY : any =  { type:3, value:'GATEWAY'}; static MODEM : any =  { type:3, value:'MODEM'}; static NETWORKAPPLIANCE : any =  { type:3, value:'NETWORKAPPLIANCE'}; static NETWORKBRIDGE : any =  { type:3, value:'NETWORKBRIDGE'}; static NETWORKHUB : any =  { type:3, value:'NETWORKHUB'}; static PRINTER : any =  { type:3, value:'PRINTER'}; static REPEATER : any =  { type:3, value:'REPEATER'}; static ROUTER : any =  { type:3, value:'ROUTER'}; static SCANNER : any =  { type:3, value:'SCANNER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcComplexPropertyTemplateTypeEnum {
	static P_COMPLEX : any =  { type:3, value:'P_COMPLEX'}; static Q_COMPLEX : any =  { type:3, value:'Q_COMPLEX'}; 
}
export class IfcCompressorTypeEnum {
	static DYNAMIC : any =  { type:3, value:'DYNAMIC'}; static RECIPROCATING : any =  { type:3, value:'RECIPROCATING'}; static ROTARY : any =  { type:3, value:'ROTARY'}; static SCROLL : any =  { type:3, value:'SCROLL'}; static TROCHOIDAL : any =  { type:3, value:'TROCHOIDAL'}; static SINGLESTAGE : any =  { type:3, value:'SINGLESTAGE'}; static BOOSTER : any =  { type:3, value:'BOOSTER'}; static OPENTYPE : any =  { type:3, value:'OPENTYPE'}; static HERMETIC : any =  { type:3, value:'HERMETIC'}; static SEMIHERMETIC : any =  { type:3, value:'SEMIHERMETIC'}; static WELDEDSHELLHERMETIC : any =  { type:3, value:'WELDEDSHELLHERMETIC'}; static ROLLINGPISTON : any =  { type:3, value:'ROLLINGPISTON'}; static ROTARYVANE : any =  { type:3, value:'ROTARYVANE'}; static SINGLESCREW : any =  { type:3, value:'SINGLESCREW'}; static TWINSCREW : any =  { type:3, value:'TWINSCREW'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCondenserTypeEnum {
	static AIRCOOLED : any =  { type:3, value:'AIRCOOLED'}; static EVAPORATIVECOOLED : any =  { type:3, value:'EVAPORATIVECOOLED'}; static WATERCOOLED : any =  { type:3, value:'WATERCOOLED'}; static WATERCOOLEDBRAZEDPLATE : any =  { type:3, value:'WATERCOOLEDBRAZEDPLATE'}; static WATERCOOLEDSHELLCOIL : any =  { type:3, value:'WATERCOOLEDSHELLCOIL'}; static WATERCOOLEDSHELLTUBE : any =  { type:3, value:'WATERCOOLEDSHELLTUBE'}; static WATERCOOLEDTUBEINTUBE : any =  { type:3, value:'WATERCOOLEDTUBEINTUBE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcConnectionTypeEnum {
	static ATPATH : any =  { type:3, value:'ATPATH'}; static ATSTART : any =  { type:3, value:'ATSTART'}; static ATEND : any =  { type:3, value:'ATEND'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcConstraintEnum {
	static HARD : any =  { type:3, value:'HARD'}; static SOFT : any =  { type:3, value:'SOFT'}; static ADVISORY : any =  { type:3, value:'ADVISORY'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcConstructionEquipmentResourceTypeEnum {
	static DEMOLISHING : any =  { type:3, value:'DEMOLISHING'}; static EARTHMOVING : any =  { type:3, value:'EARTHMOVING'}; static ERECTING : any =  { type:3, value:'ERECTING'}; static HEATING : any =  { type:3, value:'HEATING'}; static LIGHTING : any =  { type:3, value:'LIGHTING'}; static PAVING : any =  { type:3, value:'PAVING'}; static PUMPING : any =  { type:3, value:'PUMPING'}; static TRANSPORTING : any =  { type:3, value:'TRANSPORTING'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcConstructionMaterialResourceTypeEnum {
	static AGGREGATES : any =  { type:3, value:'AGGREGATES'}; static CONCRETE : any =  { type:3, value:'CONCRETE'}; static DRYWALL : any =  { type:3, value:'DRYWALL'}; static FUEL : any =  { type:3, value:'FUEL'}; static GYPSUM : any =  { type:3, value:'GYPSUM'}; static MASONRY : any =  { type:3, value:'MASONRY'}; static METAL : any =  { type:3, value:'METAL'}; static PLASTIC : any =  { type:3, value:'PLASTIC'}; static WOOD : any =  { type:3, value:'WOOD'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; 
}
export class IfcConstructionProductResourceTypeEnum {
	static ASSEMBLY : any =  { type:3, value:'ASSEMBLY'}; static FORMWORK : any =  { type:3, value:'FORMWORK'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcControllerTypeEnum {
	static FLOATING : any =  { type:3, value:'FLOATING'}; static PROGRAMMABLE : any =  { type:3, value:'PROGRAMMABLE'}; static PROPORTIONAL : any =  { type:3, value:'PROPORTIONAL'}; static MULTIPOSITION : any =  { type:3, value:'MULTIPOSITION'}; static TWOPOSITION : any =  { type:3, value:'TWOPOSITION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCooledBeamTypeEnum {
	static ACTIVE : any =  { type:3, value:'ACTIVE'}; static PASSIVE : any =  { type:3, value:'PASSIVE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCoolingTowerTypeEnum {
	static NATURALDRAFT : any =  { type:3, value:'NATURALDRAFT'}; static MECHANICALINDUCEDDRAFT : any =  { type:3, value:'MECHANICALINDUCEDDRAFT'}; static MECHANICALFORCEDDRAFT : any =  { type:3, value:'MECHANICALFORCEDDRAFT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCostItemTypeEnum {
	static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCostScheduleTypeEnum {
	static BUDGET : any =  { type:3, value:'BUDGET'}; static COSTPLAN : any =  { type:3, value:'COSTPLAN'}; static ESTIMATE : any =  { type:3, value:'ESTIMATE'}; static TENDER : any =  { type:3, value:'TENDER'}; static PRICEDBILLOFQUANTITIES : any =  { type:3, value:'PRICEDBILLOFQUANTITIES'}; static UNPRICEDBILLOFQUANTITIES : any =  { type:3, value:'UNPRICEDBILLOFQUANTITIES'}; static SCHEDULEOFRATES : any =  { type:3, value:'SCHEDULEOFRATES'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCoveringTypeEnum {
	static CEILING : any =  { type:3, value:'CEILING'}; static FLOORING : any =  { type:3, value:'FLOORING'}; static CLADDING : any =  { type:3, value:'CLADDING'}; static ROOFING : any =  { type:3, value:'ROOFING'}; static MOLDING : any =  { type:3, value:'MOLDING'}; static SKIRTINGBOARD : any =  { type:3, value:'SKIRTINGBOARD'}; static INSULATION : any =  { type:3, value:'INSULATION'}; static MEMBRANE : any =  { type:3, value:'MEMBRANE'}; static SLEEVING : any =  { type:3, value:'SLEEVING'}; static WRAPPING : any =  { type:3, value:'WRAPPING'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCrewResourceTypeEnum {
	static OFFICE : any =  { type:3, value:'OFFICE'}; static SITE : any =  { type:3, value:'SITE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCurtainWallTypeEnum {
	static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCurveInterpolationEnum {
	static LINEAR : any =  { type:3, value:'LINEAR'}; static LOG_LINEAR : any =  { type:3, value:'LOG_LINEAR'}; static LOG_LOG : any =  { type:3, value:'LOG_LOG'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDamperTypeEnum {
	static BACKDRAFTDAMPER : any =  { type:3, value:'BACKDRAFTDAMPER'}; static BALANCINGDAMPER : any =  { type:3, value:'BALANCINGDAMPER'}; static BLASTDAMPER : any =  { type:3, value:'BLASTDAMPER'}; static CONTROLDAMPER : any =  { type:3, value:'CONTROLDAMPER'}; static FIREDAMPER : any =  { type:3, value:'FIREDAMPER'}; static FIRESMOKEDAMPER : any =  { type:3, value:'FIRESMOKEDAMPER'}; static FUMEHOODEXHAUST : any =  { type:3, value:'FUMEHOODEXHAUST'}; static GRAVITYDAMPER : any =  { type:3, value:'GRAVITYDAMPER'}; static GRAVITYRELIEFDAMPER : any =  { type:3, value:'GRAVITYRELIEFDAMPER'}; static RELIEFDAMPER : any =  { type:3, value:'RELIEFDAMPER'}; static SMOKEDAMPER : any =  { type:3, value:'SMOKEDAMPER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDataOriginEnum {
	static MEASURED : any =  { type:3, value:'MEASURED'}; static PREDICTED : any =  { type:3, value:'PREDICTED'}; static SIMULATED : any =  { type:3, value:'SIMULATED'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDerivedUnitEnum {
	static ANGULARVELOCITYUNIT : any =  { type:3, value:'ANGULARVELOCITYUNIT'}; static AREADENSITYUNIT : any =  { type:3, value:'AREADENSITYUNIT'}; static COMPOUNDPLANEANGLEUNIT : any =  { type:3, value:'COMPOUNDPLANEANGLEUNIT'}; static DYNAMICVISCOSITYUNIT : any =  { type:3, value:'DYNAMICVISCOSITYUNIT'}; static HEATFLUXDENSITYUNIT : any =  { type:3, value:'HEATFLUXDENSITYUNIT'}; static INTEGERCOUNTRATEUNIT : any =  { type:3, value:'INTEGERCOUNTRATEUNIT'}; static ISOTHERMALMOISTURECAPACITYUNIT : any =  { type:3, value:'ISOTHERMALMOISTURECAPACITYUNIT'}; static KINEMATICVISCOSITYUNIT : any =  { type:3, value:'KINEMATICVISCOSITYUNIT'}; static LINEARVELOCITYUNIT : any =  { type:3, value:'LINEARVELOCITYUNIT'}; static MASSDENSITYUNIT : any =  { type:3, value:'MASSDENSITYUNIT'}; static MASSFLOWRATEUNIT : any =  { type:3, value:'MASSFLOWRATEUNIT'}; static MOISTUREDIFFUSIVITYUNIT : any =  { type:3, value:'MOISTUREDIFFUSIVITYUNIT'}; static MOLECULARWEIGHTUNIT : any =  { type:3, value:'MOLECULARWEIGHTUNIT'}; static SPECIFICHEATCAPACITYUNIT : any =  { type:3, value:'SPECIFICHEATCAPACITYUNIT'}; static THERMALADMITTANCEUNIT : any =  { type:3, value:'THERMALADMITTANCEUNIT'}; static THERMALCONDUCTANCEUNIT : any =  { type:3, value:'THERMALCONDUCTANCEUNIT'}; static THERMALRESISTANCEUNIT : any =  { type:3, value:'THERMALRESISTANCEUNIT'}; static THERMALTRANSMITTANCEUNIT : any =  { type:3, value:'THERMALTRANSMITTANCEUNIT'}; static VAPORPERMEABILITYUNIT : any =  { type:3, value:'VAPORPERMEABILITYUNIT'}; static VOLUMETRICFLOWRATEUNIT : any =  { type:3, value:'VOLUMETRICFLOWRATEUNIT'}; static ROTATIONALFREQUENCYUNIT : any =  { type:3, value:'ROTATIONALFREQUENCYUNIT'}; static TORQUEUNIT : any =  { type:3, value:'TORQUEUNIT'}; static MOMENTOFINERTIAUNIT : any =  { type:3, value:'MOMENTOFINERTIAUNIT'}; static LINEARMOMENTUNIT : any =  { type:3, value:'LINEARMOMENTUNIT'}; static LINEARFORCEUNIT : any =  { type:3, value:'LINEARFORCEUNIT'}; static PLANARFORCEUNIT : any =  { type:3, value:'PLANARFORCEUNIT'}; static MODULUSOFELASTICITYUNIT : any =  { type:3, value:'MODULUSOFELASTICITYUNIT'}; static SHEARMODULUSUNIT : any =  { type:3, value:'SHEARMODULUSUNIT'}; static LINEARSTIFFNESSUNIT : any =  { type:3, value:'LINEARSTIFFNESSUNIT'}; static ROTATIONALSTIFFNESSUNIT : any =  { type:3, value:'ROTATIONALSTIFFNESSUNIT'}; static MODULUSOFSUBGRADEREACTIONUNIT : any =  { type:3, value:'MODULUSOFSUBGRADEREACTIONUNIT'}; static ACCELERATIONUNIT : any =  { type:3, value:'ACCELERATIONUNIT'}; static CURVATUREUNIT : any =  { type:3, value:'CURVATUREUNIT'}; static HEATINGVALUEUNIT : any =  { type:3, value:'HEATINGVALUEUNIT'}; static IONCONCENTRATIONUNIT : any =  { type:3, value:'IONCONCENTRATIONUNIT'}; static LUMINOUSINTENSITYDISTRIBUTIONUNIT : any =  { type:3, value:'LUMINOUSINTENSITYDISTRIBUTIONUNIT'}; static MASSPERLENGTHUNIT : any =  { type:3, value:'MASSPERLENGTHUNIT'}; static MODULUSOFLINEARSUBGRADEREACTIONUNIT : any =  { type:3, value:'MODULUSOFLINEARSUBGRADEREACTIONUNIT'}; static MODULUSOFROTATIONALSUBGRADEREACTIONUNIT : any =  { type:3, value:'MODULUSOFROTATIONALSUBGRADEREACTIONUNIT'}; static PHUNIT : any =  { type:3, value:'PHUNIT'}; static ROTATIONALMASSUNIT : any =  { type:3, value:'ROTATIONALMASSUNIT'}; static SECTIONAREAINTEGRALUNIT : any =  { type:3, value:'SECTIONAREAINTEGRALUNIT'}; static SECTIONMODULUSUNIT : any =  { type:3, value:'SECTIONMODULUSUNIT'}; static SOUNDPOWERLEVELUNIT : any =  { type:3, value:'SOUNDPOWERLEVELUNIT'}; static SOUNDPOWERUNIT : any =  { type:3, value:'SOUNDPOWERUNIT'}; static SOUNDPRESSURELEVELUNIT : any =  { type:3, value:'SOUNDPRESSURELEVELUNIT'}; static SOUNDPRESSUREUNIT : any =  { type:3, value:'SOUNDPRESSUREUNIT'}; static TEMPERATUREGRADIENTUNIT : any =  { type:3, value:'TEMPERATUREGRADIENTUNIT'}; static TEMPERATURERATEOFCHANGEUNIT : any =  { type:3, value:'TEMPERATURERATEOFCHANGEUNIT'}; static THERMALEXPANSIONCOEFFICIENTUNIT : any =  { type:3, value:'THERMALEXPANSIONCOEFFICIENTUNIT'}; static WARPINGCONSTANTUNIT : any =  { type:3, value:'WARPINGCONSTANTUNIT'}; static WARPINGMOMENTUNIT : any =  { type:3, value:'WARPINGMOMENTUNIT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; 
}
export class IfcDirectionSenseEnum {
	static POSITIVE : any =  { type:3, value:'POSITIVE'}; static NEGATIVE : any =  { type:3, value:'NEGATIVE'}; 
}
export class IfcDiscreteAccessoryTypeEnum {
	static ANCHORPLATE : any =  { type:3, value:'ANCHORPLATE'}; static BRACKET : any =  { type:3, value:'BRACKET'}; static SHOE : any =  { type:3, value:'SHOE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDistributionChamberElementTypeEnum {
	static FORMEDDUCT : any =  { type:3, value:'FORMEDDUCT'}; static INSPECTIONCHAMBER : any =  { type:3, value:'INSPECTIONCHAMBER'}; static INSPECTIONPIT : any =  { type:3, value:'INSPECTIONPIT'}; static MANHOLE : any =  { type:3, value:'MANHOLE'}; static METERCHAMBER : any =  { type:3, value:'METERCHAMBER'}; static SUMP : any =  { type:3, value:'SUMP'}; static TRENCH : any =  { type:3, value:'TRENCH'}; static VALVECHAMBER : any =  { type:3, value:'VALVECHAMBER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDistributionPortTypeEnum {
	static CABLE : any =  { type:3, value:'CABLE'}; static CABLECARRIER : any =  { type:3, value:'CABLECARRIER'}; static DUCT : any =  { type:3, value:'DUCT'}; static PIPE : any =  { type:3, value:'PIPE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDistributionSystemEnum {
	static AIRCONDITIONING : any =  { type:3, value:'AIRCONDITIONING'}; static AUDIOVISUAL : any =  { type:3, value:'AUDIOVISUAL'}; static CHEMICAL : any =  { type:3, value:'CHEMICAL'}; static CHILLEDWATER : any =  { type:3, value:'CHILLEDWATER'}; static COMMUNICATION : any =  { type:3, value:'COMMUNICATION'}; static COMPRESSEDAIR : any =  { type:3, value:'COMPRESSEDAIR'}; static CONDENSERWATER : any =  { type:3, value:'CONDENSERWATER'}; static CONTROL : any =  { type:3, value:'CONTROL'}; static CONVEYING : any =  { type:3, value:'CONVEYING'}; static DATA : any =  { type:3, value:'DATA'}; static DISPOSAL : any =  { type:3, value:'DISPOSAL'}; static DOMESTICCOLDWATER : any =  { type:3, value:'DOMESTICCOLDWATER'}; static DOMESTICHOTWATER : any =  { type:3, value:'DOMESTICHOTWATER'}; static DRAINAGE : any =  { type:3, value:'DRAINAGE'}; static EARTHING : any =  { type:3, value:'EARTHING'}; static ELECTRICAL : any =  { type:3, value:'ELECTRICAL'}; static ELECTROACOUSTIC : any =  { type:3, value:'ELECTROACOUSTIC'}; static EXHAUST : any =  { type:3, value:'EXHAUST'}; static FIREPROTECTION : any =  { type:3, value:'FIREPROTECTION'}; static FUEL : any =  { type:3, value:'FUEL'}; static GAS : any =  { type:3, value:'GAS'}; static HAZARDOUS : any =  { type:3, value:'HAZARDOUS'}; static HEATING : any =  { type:3, value:'HEATING'}; static LIGHTING : any =  { type:3, value:'LIGHTING'}; static LIGHTNINGPROTECTION : any =  { type:3, value:'LIGHTNINGPROTECTION'}; static MUNICIPALSOLIDWASTE : any =  { type:3, value:'MUNICIPALSOLIDWASTE'}; static OIL : any =  { type:3, value:'OIL'}; static OPERATIONAL : any =  { type:3, value:'OPERATIONAL'}; static POWERGENERATION : any =  { type:3, value:'POWERGENERATION'}; static RAINWATER : any =  { type:3, value:'RAINWATER'}; static REFRIGERATION : any =  { type:3, value:'REFRIGERATION'}; static SECURITY : any =  { type:3, value:'SECURITY'}; static SEWAGE : any =  { type:3, value:'SEWAGE'}; static SIGNAL : any =  { type:3, value:'SIGNAL'}; static STORMWATER : any =  { type:3, value:'STORMWATER'}; static TELEPHONE : any =  { type:3, value:'TELEPHONE'}; static TV : any =  { type:3, value:'TV'}; static VACUUM : any =  { type:3, value:'VACUUM'}; static VENT : any =  { type:3, value:'VENT'}; static VENTILATION : any =  { type:3, value:'VENTILATION'}; static WASTEWATER : any =  { type:3, value:'WASTEWATER'}; static WATERSUPPLY : any =  { type:3, value:'WATERSUPPLY'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDocumentConfidentialityEnum {
	static PUBLIC : any =  { type:3, value:'PUBLIC'}; static RESTRICTED : any =  { type:3, value:'RESTRICTED'}; static CONFIDENTIAL : any =  { type:3, value:'CONFIDENTIAL'}; static PERSONAL : any =  { type:3, value:'PERSONAL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDocumentStatusEnum {
	static DRAFT : any =  { type:3, value:'DRAFT'}; static FINALDRAFT : any =  { type:3, value:'FINALDRAFT'}; static FINAL : any =  { type:3, value:'FINAL'}; static REVISION : any =  { type:3, value:'REVISION'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDoorPanelOperationEnum {
	static SWINGING : any =  { type:3, value:'SWINGING'}; static DOUBLE_ACTING : any =  { type:3, value:'DOUBLE_ACTING'}; static SLIDING : any =  { type:3, value:'SLIDING'}; static FOLDING : any =  { type:3, value:'FOLDING'}; static REVOLVING : any =  { type:3, value:'REVOLVING'}; static ROLLINGUP : any =  { type:3, value:'ROLLINGUP'}; static FIXEDPANEL : any =  { type:3, value:'FIXEDPANEL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
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
export class IfcDoorTypeEnum {
	static DOOR : any =  { type:3, value:'DOOR'}; static GATE : any =  { type:3, value:'GATE'}; static TRAPDOOR : any =  { type:3, value:'TRAPDOOR'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDoorTypeOperationEnum {
	static SINGLE_SWING_LEFT : any =  { type:3, value:'SINGLE_SWING_LEFT'}; static SINGLE_SWING_RIGHT : any =  { type:3, value:'SINGLE_SWING_RIGHT'}; static DOUBLE_DOOR_SINGLE_SWING : any =  { type:3, value:'DOUBLE_DOOR_SINGLE_SWING'}; static DOUBLE_DOOR_SINGLE_SWING_OPPOSITE_LEFT : any =  { type:3, value:'DOUBLE_DOOR_SINGLE_SWING_OPPOSITE_LEFT'}; static DOUBLE_DOOR_SINGLE_SWING_OPPOSITE_RIGHT : any =  { type:3, value:'DOUBLE_DOOR_SINGLE_SWING_OPPOSITE_RIGHT'}; static DOUBLE_SWING_LEFT : any =  { type:3, value:'DOUBLE_SWING_LEFT'}; static DOUBLE_SWING_RIGHT : any =  { type:3, value:'DOUBLE_SWING_RIGHT'}; static DOUBLE_DOOR_DOUBLE_SWING : any =  { type:3, value:'DOUBLE_DOOR_DOUBLE_SWING'}; static SLIDING_TO_LEFT : any =  { type:3, value:'SLIDING_TO_LEFT'}; static SLIDING_TO_RIGHT : any =  { type:3, value:'SLIDING_TO_RIGHT'}; static DOUBLE_DOOR_SLIDING : any =  { type:3, value:'DOUBLE_DOOR_SLIDING'}; static FOLDING_TO_LEFT : any =  { type:3, value:'FOLDING_TO_LEFT'}; static FOLDING_TO_RIGHT : any =  { type:3, value:'FOLDING_TO_RIGHT'}; static DOUBLE_DOOR_FOLDING : any =  { type:3, value:'DOUBLE_DOOR_FOLDING'}; static REVOLVING : any =  { type:3, value:'REVOLVING'}; static ROLLINGUP : any =  { type:3, value:'ROLLINGUP'}; static SWING_FIXED_LEFT : any =  { type:3, value:'SWING_FIXED_LEFT'}; static SWING_FIXED_RIGHT : any =  { type:3, value:'SWING_FIXED_RIGHT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
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
	static DISHWASHER : any =  { type:3, value:'DISHWASHER'}; static ELECTRICCOOKER : any =  { type:3, value:'ELECTRICCOOKER'}; static FREESTANDINGELECTRICHEATER : any =  { type:3, value:'FREESTANDINGELECTRICHEATER'}; static FREESTANDINGFAN : any =  { type:3, value:'FREESTANDINGFAN'}; static FREESTANDINGWATERHEATER : any =  { type:3, value:'FREESTANDINGWATERHEATER'}; static FREESTANDINGWATERCOOLER : any =  { type:3, value:'FREESTANDINGWATERCOOLER'}; static FREEZER : any =  { type:3, value:'FREEZER'}; static FRIDGE_FREEZER : any =  { type:3, value:'FRIDGE_FREEZER'}; static HANDDRYER : any =  { type:3, value:'HANDDRYER'}; static KITCHENMACHINE : any =  { type:3, value:'KITCHENMACHINE'}; static MICROWAVE : any =  { type:3, value:'MICROWAVE'}; static PHOTOCOPIER : any =  { type:3, value:'PHOTOCOPIER'}; static REFRIGERATOR : any =  { type:3, value:'REFRIGERATOR'}; static TUMBLEDRYER : any =  { type:3, value:'TUMBLEDRYER'}; static VENDINGMACHINE : any =  { type:3, value:'VENDINGMACHINE'}; static WASHINGMACHINE : any =  { type:3, value:'WASHINGMACHINE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcElectricDistributionBoardTypeEnum {
	static CONSUMERUNIT : any =  { type:3, value:'CONSUMERUNIT'}; static DISTRIBUTIONBOARD : any =  { type:3, value:'DISTRIBUTIONBOARD'}; static MOTORCONTROLCENTRE : any =  { type:3, value:'MOTORCONTROLCENTRE'}; static SWITCHBOARD : any =  { type:3, value:'SWITCHBOARD'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcElectricFlowStorageDeviceTypeEnum {
	static BATTERY : any =  { type:3, value:'BATTERY'}; static CAPACITORBANK : any =  { type:3, value:'CAPACITORBANK'}; static HARMONICFILTER : any =  { type:3, value:'HARMONICFILTER'}; static INDUCTORBANK : any =  { type:3, value:'INDUCTORBANK'}; static UPS : any =  { type:3, value:'UPS'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcElectricGeneratorTypeEnum {
	static CHP : any =  { type:3, value:'CHP'}; static ENGINEGENERATOR : any =  { type:3, value:'ENGINEGENERATOR'}; static STANDALONE : any =  { type:3, value:'STANDALONE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
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
export class IfcEngineTypeEnum {
	static EXTERNALCOMBUSTION : any =  { type:3, value:'EXTERNALCOMBUSTION'}; static INTERNALCOMBUSTION : any =  { type:3, value:'INTERNALCOMBUSTION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcEvaporativeCoolerTypeEnum {
	static DIRECTEVAPORATIVERANDOMMEDIAAIRCOOLER : any =  { type:3, value:'DIRECTEVAPORATIVERANDOMMEDIAAIRCOOLER'}; static DIRECTEVAPORATIVERIGIDMEDIAAIRCOOLER : any =  { type:3, value:'DIRECTEVAPORATIVERIGIDMEDIAAIRCOOLER'}; static DIRECTEVAPORATIVESLINGERSPACKAGEDAIRCOOLER : any =  { type:3, value:'DIRECTEVAPORATIVESLINGERSPACKAGEDAIRCOOLER'}; static DIRECTEVAPORATIVEPACKAGEDROTARYAIRCOOLER : any =  { type:3, value:'DIRECTEVAPORATIVEPACKAGEDROTARYAIRCOOLER'}; static DIRECTEVAPORATIVEAIRWASHER : any =  { type:3, value:'DIRECTEVAPORATIVEAIRWASHER'}; static INDIRECTEVAPORATIVEPACKAGEAIRCOOLER : any =  { type:3, value:'INDIRECTEVAPORATIVEPACKAGEAIRCOOLER'}; static INDIRECTEVAPORATIVEWETCOIL : any =  { type:3, value:'INDIRECTEVAPORATIVEWETCOIL'}; static INDIRECTEVAPORATIVECOOLINGTOWERORCOILCOOLER : any =  { type:3, value:'INDIRECTEVAPORATIVECOOLINGTOWERORCOILCOOLER'}; static INDIRECTDIRECTCOMBINATION : any =  { type:3, value:'INDIRECTDIRECTCOMBINATION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcEvaporatorTypeEnum {
	static DIRECTEXPANSION : any =  { type:3, value:'DIRECTEXPANSION'}; static DIRECTEXPANSIONSHELLANDTUBE : any =  { type:3, value:'DIRECTEXPANSIONSHELLANDTUBE'}; static DIRECTEXPANSIONTUBEINTUBE : any =  { type:3, value:'DIRECTEXPANSIONTUBEINTUBE'}; static DIRECTEXPANSIONBRAZEDPLATE : any =  { type:3, value:'DIRECTEXPANSIONBRAZEDPLATE'}; static FLOODEDSHELLANDTUBE : any =  { type:3, value:'FLOODEDSHELLANDTUBE'}; static SHELLANDCOIL : any =  { type:3, value:'SHELLANDCOIL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcEventTriggerTypeEnum {
	static EVENTRULE : any =  { type:3, value:'EVENTRULE'}; static EVENTMESSAGE : any =  { type:3, value:'EVENTMESSAGE'}; static EVENTTIME : any =  { type:3, value:'EVENTTIME'}; static EVENTCOMPLEX : any =  { type:3, value:'EVENTCOMPLEX'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcEventTypeEnum {
	static STARTEVENT : any =  { type:3, value:'STARTEVENT'}; static ENDEVENT : any =  { type:3, value:'ENDEVENT'}; static INTERMEDIATEEVENT : any =  { type:3, value:'INTERMEDIATEEVENT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcExternalSpatialElementTypeEnum {
	static EXTERNAL : any =  { type:3, value:'EXTERNAL'}; static EXTERNAL_EARTH : any =  { type:3, value:'EXTERNAL_EARTH'}; static EXTERNAL_WATER : any =  { type:3, value:'EXTERNAL_WATER'}; static EXTERNAL_FIRE : any =  { type:3, value:'EXTERNAL_FIRE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcFanTypeEnum {
	static CENTRIFUGALFORWARDCURVED : any =  { type:3, value:'CENTRIFUGALFORWARDCURVED'}; static CENTRIFUGALRADIAL : any =  { type:3, value:'CENTRIFUGALRADIAL'}; static CENTRIFUGALBACKWARDINCLINEDCURVED : any =  { type:3, value:'CENTRIFUGALBACKWARDINCLINEDCURVED'}; static CENTRIFUGALAIRFOIL : any =  { type:3, value:'CENTRIFUGALAIRFOIL'}; static TUBEAXIAL : any =  { type:3, value:'TUBEAXIAL'}; static VANEAXIAL : any =  { type:3, value:'VANEAXIAL'}; static PROPELLORAXIAL : any =  { type:3, value:'PROPELLORAXIAL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcFastenerTypeEnum {
	static GLUE : any =  { type:3, value:'GLUE'}; static MORTAR : any =  { type:3, value:'MORTAR'}; static WELD : any =  { type:3, value:'WELD'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcFilterTypeEnum {
	static AIRPARTICLEFILTER : any =  { type:3, value:'AIRPARTICLEFILTER'}; static COMPRESSEDAIRFILTER : any =  { type:3, value:'COMPRESSEDAIRFILTER'}; static ODORFILTER : any =  { type:3, value:'ODORFILTER'}; static OILFILTER : any =  { type:3, value:'OILFILTER'}; static STRAINER : any =  { type:3, value:'STRAINER'}; static WATERFILTER : any =  { type:3, value:'WATERFILTER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
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
	static ENERGYMETER : any =  { type:3, value:'ENERGYMETER'}; static GASMETER : any =  { type:3, value:'GASMETER'}; static OILMETER : any =  { type:3, value:'OILMETER'}; static WATERMETER : any =  { type:3, value:'WATERMETER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcFootingTypeEnum {
	static CAISSON_FOUNDATION : any =  { type:3, value:'CAISSON_FOUNDATION'}; static FOOTING_BEAM : any =  { type:3, value:'FOOTING_BEAM'}; static PAD_FOOTING : any =  { type:3, value:'PAD_FOOTING'}; static PILE_CAP : any =  { type:3, value:'PILE_CAP'}; static STRIP_FOOTING : any =  { type:3, value:'STRIP_FOOTING'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcFurnitureTypeEnum {
	static CHAIR : any =  { type:3, value:'CHAIR'}; static TABLE : any =  { type:3, value:'TABLE'}; static DESK : any =  { type:3, value:'DESK'}; static BED : any =  { type:3, value:'BED'}; static FILECABINET : any =  { type:3, value:'FILECABINET'}; static SHELF : any =  { type:3, value:'SHELF'}; static SOFA : any =  { type:3, value:'SOFA'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcGeographicElementTypeEnum {
	static TERRAIN : any =  { type:3, value:'TERRAIN'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcGeometricProjectionEnum {
	static GRAPH_VIEW : any =  { type:3, value:'GRAPH_VIEW'}; static SKETCH_VIEW : any =  { type:3, value:'SKETCH_VIEW'}; static MODEL_VIEW : any =  { type:3, value:'MODEL_VIEW'}; static PLAN_VIEW : any =  { type:3, value:'PLAN_VIEW'}; static REFLECTED_PLAN_VIEW : any =  { type:3, value:'REFLECTED_PLAN_VIEW'}; static SECTION_VIEW : any =  { type:3, value:'SECTION_VIEW'}; static ELEVATION_VIEW : any =  { type:3, value:'ELEVATION_VIEW'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcGlobalOrLocalEnum {
	static GLOBAL_COORDS : any =  { type:3, value:'GLOBAL_COORDS'}; static LOCAL_COORDS : any =  { type:3, value:'LOCAL_COORDS'}; 
}
export class IfcGridTypeEnum {
	static RECTANGULAR : any =  { type:3, value:'RECTANGULAR'}; static RADIAL : any =  { type:3, value:'RADIAL'}; static TRIANGULAR : any =  { type:3, value:'TRIANGULAR'}; static IRREGULAR : any =  { type:3, value:'IRREGULAR'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcHeatExchangerTypeEnum {
	static PLATE : any =  { type:3, value:'PLATE'}; static SHELLANDTUBE : any =  { type:3, value:'SHELLANDTUBE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcHumidifierTypeEnum {
	static STEAMINJECTION : any =  { type:3, value:'STEAMINJECTION'}; static ADIABATICAIRWASHER : any =  { type:3, value:'ADIABATICAIRWASHER'}; static ADIABATICPAN : any =  { type:3, value:'ADIABATICPAN'}; static ADIABATICWETTEDELEMENT : any =  { type:3, value:'ADIABATICWETTEDELEMENT'}; static ADIABATICATOMIZING : any =  { type:3, value:'ADIABATICATOMIZING'}; static ADIABATICULTRASONIC : any =  { type:3, value:'ADIABATICULTRASONIC'}; static ADIABATICRIGIDMEDIA : any =  { type:3, value:'ADIABATICRIGIDMEDIA'}; static ADIABATICCOMPRESSEDAIRNOZZLE : any =  { type:3, value:'ADIABATICCOMPRESSEDAIRNOZZLE'}; static ASSISTEDELECTRIC : any =  { type:3, value:'ASSISTEDELECTRIC'}; static ASSISTEDNATURALGAS : any =  { type:3, value:'ASSISTEDNATURALGAS'}; static ASSISTEDPROPANE : any =  { type:3, value:'ASSISTEDPROPANE'}; static ASSISTEDBUTANE : any =  { type:3, value:'ASSISTEDBUTANE'}; static ASSISTEDSTEAM : any =  { type:3, value:'ASSISTEDSTEAM'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcInterceptorTypeEnum {
	static CYCLONIC : any =  { type:3, value:'CYCLONIC'}; static GREASE : any =  { type:3, value:'GREASE'}; static OIL : any =  { type:3, value:'OIL'}; static PETROL : any =  { type:3, value:'PETROL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcInternalOrExternalEnum {
	static INTERNAL : any =  { type:3, value:'INTERNAL'}; static EXTERNAL : any =  { type:3, value:'EXTERNAL'}; static EXTERNAL_EARTH : any =  { type:3, value:'EXTERNAL_EARTH'}; static EXTERNAL_WATER : any =  { type:3, value:'EXTERNAL_WATER'}; static EXTERNAL_FIRE : any =  { type:3, value:'EXTERNAL_FIRE'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcInventoryTypeEnum {
	static ASSETINVENTORY : any =  { type:3, value:'ASSETINVENTORY'}; static SPACEINVENTORY : any =  { type:3, value:'SPACEINVENTORY'}; static FURNITUREINVENTORY : any =  { type:3, value:'FURNITUREINVENTORY'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcJunctionBoxTypeEnum {
	static DATA : any =  { type:3, value:'DATA'}; static POWER : any =  { type:3, value:'POWER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcKnotType {
	static UNIFORM_KNOTS : any =  { type:3, value:'UNIFORM_KNOTS'}; static QUASI_UNIFORM_KNOTS : any =  { type:3, value:'QUASI_UNIFORM_KNOTS'}; static PIECEWISE_BEZIER_KNOTS : any =  { type:3, value:'PIECEWISE_BEZIER_KNOTS'}; static UNSPECIFIED : any =  { type:3, value:'UNSPECIFIED'}; 
}
export class IfcLaborResourceTypeEnum {
	static ADMINISTRATION : any =  { type:3, value:'ADMINISTRATION'}; static CARPENTRY : any =  { type:3, value:'CARPENTRY'}; static CLEANING : any =  { type:3, value:'CLEANING'}; static CONCRETE : any =  { type:3, value:'CONCRETE'}; static DRYWALL : any =  { type:3, value:'DRYWALL'}; static ELECTRIC : any =  { type:3, value:'ELECTRIC'}; static FINISHING : any =  { type:3, value:'FINISHING'}; static FLOORING : any =  { type:3, value:'FLOORING'}; static GENERAL : any =  { type:3, value:'GENERAL'}; static HVAC : any =  { type:3, value:'HVAC'}; static LANDSCAPING : any =  { type:3, value:'LANDSCAPING'}; static MASONRY : any =  { type:3, value:'MASONRY'}; static PAINTING : any =  { type:3, value:'PAINTING'}; static PAVING : any =  { type:3, value:'PAVING'}; static PLUMBING : any =  { type:3, value:'PLUMBING'}; static ROOFING : any =  { type:3, value:'ROOFING'}; static SITEGRADING : any =  { type:3, value:'SITEGRADING'}; static STEELWORK : any =  { type:3, value:'STEELWORK'}; static SURVEYING : any =  { type:3, value:'SURVEYING'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcLampTypeEnum {
	static COMPACTFLUORESCENT : any =  { type:3, value:'COMPACTFLUORESCENT'}; static FLUORESCENT : any =  { type:3, value:'FLUORESCENT'}; static HALOGEN : any =  { type:3, value:'HALOGEN'}; static HIGHPRESSUREMERCURY : any =  { type:3, value:'HIGHPRESSUREMERCURY'}; static HIGHPRESSURESODIUM : any =  { type:3, value:'HIGHPRESSURESODIUM'}; static LED : any =  { type:3, value:'LED'}; static METALHALIDE : any =  { type:3, value:'METALHALIDE'}; static OLED : any =  { type:3, value:'OLED'}; static TUNGSTENFILAMENT : any =  { type:3, value:'TUNGSTENFILAMENT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
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
	static POINTSOURCE : any =  { type:3, value:'POINTSOURCE'}; static DIRECTIONSOURCE : any =  { type:3, value:'DIRECTIONSOURCE'}; static SECURITYLIGHTING : any =  { type:3, value:'SECURITYLIGHTING'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcLoadGroupTypeEnum {
	static LOAD_GROUP : any =  { type:3, value:'LOAD_GROUP'}; static LOAD_CASE : any =  { type:3, value:'LOAD_CASE'}; static LOAD_COMBINATION : any =  { type:3, value:'LOAD_COMBINATION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcLogicalOperatorEnum {
	static LOGICALAND : any =  { type:3, value:'LOGICALAND'}; static LOGICALOR : any =  { type:3, value:'LOGICALOR'}; static LOGICALXOR : any =  { type:3, value:'LOGICALXOR'}; static LOGICALNOTAND : any =  { type:3, value:'LOGICALNOTAND'}; static LOGICALNOTOR : any =  { type:3, value:'LOGICALNOTOR'}; 
}
export class IfcMechanicalFastenerTypeEnum {
	static ANCHORBOLT : any =  { type:3, value:'ANCHORBOLT'}; static BOLT : any =  { type:3, value:'BOLT'}; static DOWEL : any =  { type:3, value:'DOWEL'}; static NAIL : any =  { type:3, value:'NAIL'}; static NAILPLATE : any =  { type:3, value:'NAILPLATE'}; static RIVET : any =  { type:3, value:'RIVET'}; static SCREW : any =  { type:3, value:'SCREW'}; static SHEARCONNECTOR : any =  { type:3, value:'SHEARCONNECTOR'}; static STAPLE : any =  { type:3, value:'STAPLE'}; static STUDSHEARCONNECTOR : any =  { type:3, value:'STUDSHEARCONNECTOR'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcMedicalDeviceTypeEnum {
	static AIRSTATION : any =  { type:3, value:'AIRSTATION'}; static FEEDAIRUNIT : any =  { type:3, value:'FEEDAIRUNIT'}; static OXYGENGENERATOR : any =  { type:3, value:'OXYGENGENERATOR'}; static OXYGENPLANT : any =  { type:3, value:'OXYGENPLANT'}; static VACUUMSTATION : any =  { type:3, value:'VACUUMSTATION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
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
	static CODECOMPLIANCE : any =  { type:3, value:'CODECOMPLIANCE'}; static CODEWAIVER : any =  { type:3, value:'CODEWAIVER'}; static DESIGNINTENT : any =  { type:3, value:'DESIGNINTENT'}; static EXTERNAL : any =  { type:3, value:'EXTERNAL'}; static HEALTHANDSAFETY : any =  { type:3, value:'HEALTHANDSAFETY'}; static MERGECONFLICT : any =  { type:3, value:'MERGECONFLICT'}; static MODELVIEW : any =  { type:3, value:'MODELVIEW'}; static PARAMETER : any =  { type:3, value:'PARAMETER'}; static REQUIREMENT : any =  { type:3, value:'REQUIREMENT'}; static SPECIFICATION : any =  { type:3, value:'SPECIFICATION'}; static TRIGGERCONDITION : any =  { type:3, value:'TRIGGERCONDITION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcOccupantTypeEnum {
	static ASSIGNEE : any =  { type:3, value:'ASSIGNEE'}; static ASSIGNOR : any =  { type:3, value:'ASSIGNOR'}; static LESSEE : any =  { type:3, value:'LESSEE'}; static LESSOR : any =  { type:3, value:'LESSOR'}; static LETTINGAGENT : any =  { type:3, value:'LETTINGAGENT'}; static OWNER : any =  { type:3, value:'OWNER'}; static TENANT : any =  { type:3, value:'TENANT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcOpeningElementTypeEnum {
	static OPENING : any =  { type:3, value:'OPENING'}; static RECESS : any =  { type:3, value:'RECESS'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcOutletTypeEnum {
	static AUDIOVISUALOUTLET : any =  { type:3, value:'AUDIOVISUALOUTLET'}; static COMMUNICATIONSOUTLET : any =  { type:3, value:'COMMUNICATIONSOUTLET'}; static POWEROUTLET : any =  { type:3, value:'POWEROUTLET'}; static DATAOUTLET : any =  { type:3, value:'DATAOUTLET'}; static TELEPHONEOUTLET : any =  { type:3, value:'TELEPHONEOUTLET'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPerformanceHistoryTypeEnum {
	static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPermeableCoveringOperationEnum {
	static GRILL : any =  { type:3, value:'GRILL'}; static LOUVER : any =  { type:3, value:'LOUVER'}; static SCREEN : any =  { type:3, value:'SCREEN'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPermitTypeEnum {
	static ACCESS : any =  { type:3, value:'ACCESS'}; static BUILDING : any =  { type:3, value:'BUILDING'}; static WORK : any =  { type:3, value:'WORK'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPhysicalOrVirtualEnum {
	static PHYSICAL : any =  { type:3, value:'PHYSICAL'}; static VIRTUAL : any =  { type:3, value:'VIRTUAL'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPileConstructionEnum {
	static CAST_IN_PLACE : any =  { type:3, value:'CAST_IN_PLACE'}; static COMPOSITE : any =  { type:3, value:'COMPOSITE'}; static PRECAST_CONCRETE : any =  { type:3, value:'PRECAST_CONCRETE'}; static PREFAB_STEEL : any =  { type:3, value:'PREFAB_STEEL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPileTypeEnum {
	static BORED : any =  { type:3, value:'BORED'}; static DRIVEN : any =  { type:3, value:'DRIVEN'}; static JETGROUTING : any =  { type:3, value:'JETGROUTING'}; static COHESION : any =  { type:3, value:'COHESION'}; static FRICTION : any =  { type:3, value:'FRICTION'}; static SUPPORT : any =  { type:3, value:'SUPPORT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPipeFittingTypeEnum {
	static BEND : any =  { type:3, value:'BEND'}; static CONNECTOR : any =  { type:3, value:'CONNECTOR'}; static ENTRY : any =  { type:3, value:'ENTRY'}; static EXIT : any =  { type:3, value:'EXIT'}; static JUNCTION : any =  { type:3, value:'JUNCTION'}; static OBSTRUCTION : any =  { type:3, value:'OBSTRUCTION'}; static TRANSITION : any =  { type:3, value:'TRANSITION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPipeSegmentTypeEnum {
	static CULVERT : any =  { type:3, value:'CULVERT'}; static FLEXIBLESEGMENT : any =  { type:3, value:'FLEXIBLESEGMENT'}; static RIGIDSEGMENT : any =  { type:3, value:'RIGIDSEGMENT'}; static GUTTER : any =  { type:3, value:'GUTTER'}; static SPOOL : any =  { type:3, value:'SPOOL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPlateTypeEnum {
	static CURTAIN_PANEL : any =  { type:3, value:'CURTAIN_PANEL'}; static SHEET : any =  { type:3, value:'SHEET'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPreferredSurfaceCurveRepresentation {
	static CURVE3D : any =  { type:3, value:'CURVE3D'}; static PCURVE_S1 : any =  { type:3, value:'PCURVE_S1'}; static PCURVE_S2 : any =  { type:3, value:'PCURVE_S2'}; 
}
export class IfcProcedureTypeEnum {
	static ADVICE_CAUTION : any =  { type:3, value:'ADVICE_CAUTION'}; static ADVICE_NOTE : any =  { type:3, value:'ADVICE_NOTE'}; static ADVICE_WARNING : any =  { type:3, value:'ADVICE_WARNING'}; static CALIBRATION : any =  { type:3, value:'CALIBRATION'}; static DIAGNOSTIC : any =  { type:3, value:'DIAGNOSTIC'}; static SHUTDOWN : any =  { type:3, value:'SHUTDOWN'}; static STARTUP : any =  { type:3, value:'STARTUP'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcProfileTypeEnum {
	static CURVE : any =  { type:3, value:'CURVE'}; static AREA : any =  { type:3, value:'AREA'}; 
}
export class IfcProjectOrderTypeEnum {
	static CHANGEORDER : any =  { type:3, value:'CHANGEORDER'}; static MAINTENANCEWORKORDER : any =  { type:3, value:'MAINTENANCEWORKORDER'}; static MOVEORDER : any =  { type:3, value:'MOVEORDER'}; static PURCHASEORDER : any =  { type:3, value:'PURCHASEORDER'}; static WORKORDER : any =  { type:3, value:'WORKORDER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcProjectedOrTrueLengthEnum {
	static PROJECTED_LENGTH : any =  { type:3, value:'PROJECTED_LENGTH'}; static TRUE_LENGTH : any =  { type:3, value:'TRUE_LENGTH'}; 
}
export class IfcProjectionElementTypeEnum {
	static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPropertySetTemplateTypeEnum {
	static PSET_TYPEDRIVENONLY : any =  { type:3, value:'PSET_TYPEDRIVENONLY'}; static PSET_TYPEDRIVENOVERRIDE : any =  { type:3, value:'PSET_TYPEDRIVENOVERRIDE'}; static PSET_OCCURRENCEDRIVEN : any =  { type:3, value:'PSET_OCCURRENCEDRIVEN'}; static PSET_PERFORMANCEDRIVEN : any =  { type:3, value:'PSET_PERFORMANCEDRIVEN'}; static QTO_TYPEDRIVENONLY : any =  { type:3, value:'QTO_TYPEDRIVENONLY'}; static QTO_TYPEDRIVENOVERRIDE : any =  { type:3, value:'QTO_TYPEDRIVENOVERRIDE'}; static QTO_OCCURRENCEDRIVEN : any =  { type:3, value:'QTO_OCCURRENCEDRIVEN'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcProtectiveDeviceTrippingUnitTypeEnum {
	static ELECTRONIC : any =  { type:3, value:'ELECTRONIC'}; static ELECTROMAGNETIC : any =  { type:3, value:'ELECTROMAGNETIC'}; static RESIDUALCURRENT : any =  { type:3, value:'RESIDUALCURRENT'}; static THERMAL : any =  { type:3, value:'THERMAL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcProtectiveDeviceTypeEnum {
	static CIRCUITBREAKER : any =  { type:3, value:'CIRCUITBREAKER'}; static EARTHLEAKAGECIRCUITBREAKER : any =  { type:3, value:'EARTHLEAKAGECIRCUITBREAKER'}; static EARTHINGSWITCH : any =  { type:3, value:'EARTHINGSWITCH'}; static FUSEDISCONNECTOR : any =  { type:3, value:'FUSEDISCONNECTOR'}; static RESIDUALCURRENTCIRCUITBREAKER : any =  { type:3, value:'RESIDUALCURRENTCIRCUITBREAKER'}; static RESIDUALCURRENTSWITCH : any =  { type:3, value:'RESIDUALCURRENTSWITCH'}; static VARISTOR : any =  { type:3, value:'VARISTOR'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPumpTypeEnum {
	static CIRCULATOR : any =  { type:3, value:'CIRCULATOR'}; static ENDSUCTION : any =  { type:3, value:'ENDSUCTION'}; static SPLITCASE : any =  { type:3, value:'SPLITCASE'}; static SUBMERSIBLEPUMP : any =  { type:3, value:'SUBMERSIBLEPUMP'}; static SUMPPUMP : any =  { type:3, value:'SUMPPUMP'}; static VERTICALINLINE : any =  { type:3, value:'VERTICALINLINE'}; static VERTICALTURBINE : any =  { type:3, value:'VERTICALTURBINE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
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
export class IfcRecurrenceTypeEnum {
	static DAILY : any =  { type:3, value:'DAILY'}; static WEEKLY : any =  { type:3, value:'WEEKLY'}; static MONTHLY_BY_DAY_OF_MONTH : any =  { type:3, value:'MONTHLY_BY_DAY_OF_MONTH'}; static MONTHLY_BY_POSITION : any =  { type:3, value:'MONTHLY_BY_POSITION'}; static BY_DAY_COUNT : any =  { type:3, value:'BY_DAY_COUNT'}; static BY_WEEKDAY_COUNT : any =  { type:3, value:'BY_WEEKDAY_COUNT'}; static YEARLY_BY_DAY_OF_MONTH : any =  { type:3, value:'YEARLY_BY_DAY_OF_MONTH'}; static YEARLY_BY_POSITION : any =  { type:3, value:'YEARLY_BY_POSITION'}; 
}
export class IfcReflectanceMethodEnum {
	static BLINN : any =  { type:3, value:'BLINN'}; static FLAT : any =  { type:3, value:'FLAT'}; static GLASS : any =  { type:3, value:'GLASS'}; static MATT : any =  { type:3, value:'MATT'}; static METAL : any =  { type:3, value:'METAL'}; static MIRROR : any =  { type:3, value:'MIRROR'}; static PHONG : any =  { type:3, value:'PHONG'}; static PLASTIC : any =  { type:3, value:'PLASTIC'}; static STRAUSS : any =  { type:3, value:'STRAUSS'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcReinforcingBarRoleEnum {
	static MAIN : any =  { type:3, value:'MAIN'}; static SHEAR : any =  { type:3, value:'SHEAR'}; static LIGATURE : any =  { type:3, value:'LIGATURE'}; static STUD : any =  { type:3, value:'STUD'}; static PUNCHING : any =  { type:3, value:'PUNCHING'}; static EDGE : any =  { type:3, value:'EDGE'}; static RING : any =  { type:3, value:'RING'}; static ANCHORING : any =  { type:3, value:'ANCHORING'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcReinforcingBarSurfaceEnum {
	static PLAIN : any =  { type:3, value:'PLAIN'}; static TEXTURED : any =  { type:3, value:'TEXTURED'}; 
}
export class IfcReinforcingBarTypeEnum {
	static ANCHORING : any =  { type:3, value:'ANCHORING'}; static EDGE : any =  { type:3, value:'EDGE'}; static LIGATURE : any =  { type:3, value:'LIGATURE'}; static MAIN : any =  { type:3, value:'MAIN'}; static PUNCHING : any =  { type:3, value:'PUNCHING'}; static RING : any =  { type:3, value:'RING'}; static SHEAR : any =  { type:3, value:'SHEAR'}; static STUD : any =  { type:3, value:'STUD'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcReinforcingMeshTypeEnum {
	static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcRoleEnum {
	static SUPPLIER : any =  { type:3, value:'SUPPLIER'}; static MANUFACTURER : any =  { type:3, value:'MANUFACTURER'}; static CONTRACTOR : any =  { type:3, value:'CONTRACTOR'}; static SUBCONTRACTOR : any =  { type:3, value:'SUBCONTRACTOR'}; static ARCHITECT : any =  { type:3, value:'ARCHITECT'}; static STRUCTURALENGINEER : any =  { type:3, value:'STRUCTURALENGINEER'}; static COSTENGINEER : any =  { type:3, value:'COSTENGINEER'}; static CLIENT : any =  { type:3, value:'CLIENT'}; static BUILDINGOWNER : any =  { type:3, value:'BUILDINGOWNER'}; static BUILDINGOPERATOR : any =  { type:3, value:'BUILDINGOPERATOR'}; static MECHANICALENGINEER : any =  { type:3, value:'MECHANICALENGINEER'}; static ELECTRICALENGINEER : any =  { type:3, value:'ELECTRICALENGINEER'}; static PROJECTMANAGER : any =  { type:3, value:'PROJECTMANAGER'}; static FACILITIESMANAGER : any =  { type:3, value:'FACILITIESMANAGER'}; static CIVILENGINEER : any =  { type:3, value:'CIVILENGINEER'}; static COMMISSIONINGENGINEER : any =  { type:3, value:'COMMISSIONINGENGINEER'}; static ENGINEER : any =  { type:3, value:'ENGINEER'}; static OWNER : any =  { type:3, value:'OWNER'}; static CONSULTANT : any =  { type:3, value:'CONSULTANT'}; static CONSTRUCTIONMANAGER : any =  { type:3, value:'CONSTRUCTIONMANAGER'}; static FIELDCONSTRUCTIONMANAGER : any =  { type:3, value:'FIELDCONSTRUCTIONMANAGER'}; static RESELLER : any =  { type:3, value:'RESELLER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; 
}
export class IfcRoofTypeEnum {
	static FLAT_ROOF : any =  { type:3, value:'FLAT_ROOF'}; static SHED_ROOF : any =  { type:3, value:'SHED_ROOF'}; static GABLE_ROOF : any =  { type:3, value:'GABLE_ROOF'}; static HIP_ROOF : any =  { type:3, value:'HIP_ROOF'}; static HIPPED_GABLE_ROOF : any =  { type:3, value:'HIPPED_GABLE_ROOF'}; static GAMBREL_ROOF : any =  { type:3, value:'GAMBREL_ROOF'}; static MANSARD_ROOF : any =  { type:3, value:'MANSARD_ROOF'}; static BARREL_ROOF : any =  { type:3, value:'BARREL_ROOF'}; static RAINBOW_ROOF : any =  { type:3, value:'RAINBOW_ROOF'}; static BUTTERFLY_ROOF : any =  { type:3, value:'BUTTERFLY_ROOF'}; static PAVILION_ROOF : any =  { type:3, value:'PAVILION_ROOF'}; static DOME_ROOF : any =  { type:3, value:'DOME_ROOF'}; static FREEFORM : any =  { type:3, value:'FREEFORM'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
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
	static COSENSOR : any =  { type:3, value:'COSENSOR'}; static CO2SENSOR : any =  { type:3, value:'CO2SENSOR'}; static CONDUCTANCESENSOR : any =  { type:3, value:'CONDUCTANCESENSOR'}; static CONTACTSENSOR : any =  { type:3, value:'CONTACTSENSOR'}; static FIRESENSOR : any =  { type:3, value:'FIRESENSOR'}; static FLOWSENSOR : any =  { type:3, value:'FLOWSENSOR'}; static FROSTSENSOR : any =  { type:3, value:'FROSTSENSOR'}; static GASSENSOR : any =  { type:3, value:'GASSENSOR'}; static HEATSENSOR : any =  { type:3, value:'HEATSENSOR'}; static HUMIDITYSENSOR : any =  { type:3, value:'HUMIDITYSENSOR'}; static IDENTIFIERSENSOR : any =  { type:3, value:'IDENTIFIERSENSOR'}; static IONCONCENTRATIONSENSOR : any =  { type:3, value:'IONCONCENTRATIONSENSOR'}; static LEVELSENSOR : any =  { type:3, value:'LEVELSENSOR'}; static LIGHTSENSOR : any =  { type:3, value:'LIGHTSENSOR'}; static MOISTURESENSOR : any =  { type:3, value:'MOISTURESENSOR'}; static MOVEMENTSENSOR : any =  { type:3, value:'MOVEMENTSENSOR'}; static PHSENSOR : any =  { type:3, value:'PHSENSOR'}; static PRESSURESENSOR : any =  { type:3, value:'PRESSURESENSOR'}; static RADIATIONSENSOR : any =  { type:3, value:'RADIATIONSENSOR'}; static RADIOACTIVITYSENSOR : any =  { type:3, value:'RADIOACTIVITYSENSOR'}; static SMOKESENSOR : any =  { type:3, value:'SMOKESENSOR'}; static SOUNDSENSOR : any =  { type:3, value:'SOUNDSENSOR'}; static TEMPERATURESENSOR : any =  { type:3, value:'TEMPERATURESENSOR'}; static WINDSENSOR : any =  { type:3, value:'WINDSENSOR'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSequenceEnum {
	static START_START : any =  { type:3, value:'START_START'}; static START_FINISH : any =  { type:3, value:'START_FINISH'}; static FINISH_START : any =  { type:3, value:'FINISH_START'}; static FINISH_FINISH : any =  { type:3, value:'FINISH_FINISH'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcShadingDeviceTypeEnum {
	static JALOUSIE : any =  { type:3, value:'JALOUSIE'}; static SHUTTER : any =  { type:3, value:'SHUTTER'}; static AWNING : any =  { type:3, value:'AWNING'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSimplePropertyTemplateTypeEnum {
	static P_SINGLEVALUE : any =  { type:3, value:'P_SINGLEVALUE'}; static P_ENUMERATEDVALUE : any =  { type:3, value:'P_ENUMERATEDVALUE'}; static P_BOUNDEDVALUE : any =  { type:3, value:'P_BOUNDEDVALUE'}; static P_LISTVALUE : any =  { type:3, value:'P_LISTVALUE'}; static P_TABLEVALUE : any =  { type:3, value:'P_TABLEVALUE'}; static P_REFERENCEVALUE : any =  { type:3, value:'P_REFERENCEVALUE'}; static Q_LENGTH : any =  { type:3, value:'Q_LENGTH'}; static Q_AREA : any =  { type:3, value:'Q_AREA'}; static Q_VOLUME : any =  { type:3, value:'Q_VOLUME'}; static Q_COUNT : any =  { type:3, value:'Q_COUNT'}; static Q_WEIGHT : any =  { type:3, value:'Q_WEIGHT'}; static Q_TIME : any =  { type:3, value:'Q_TIME'}; 
}
export class IfcSlabTypeEnum {
	static FLOOR : any =  { type:3, value:'FLOOR'}; static ROOF : any =  { type:3, value:'ROOF'}; static LANDING : any =  { type:3, value:'LANDING'}; static BASESLAB : any =  { type:3, value:'BASESLAB'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSolarDeviceTypeEnum {
	static SOLARCOLLECTOR : any =  { type:3, value:'SOLARCOLLECTOR'}; static SOLARPANEL : any =  { type:3, value:'SOLARPANEL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSpaceHeaterTypeEnum {
	static CONVECTOR : any =  { type:3, value:'CONVECTOR'}; static RADIATOR : any =  { type:3, value:'RADIATOR'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSpaceTypeEnum {
	static SPACE : any =  { type:3, value:'SPACE'}; static PARKING : any =  { type:3, value:'PARKING'}; static GFA : any =  { type:3, value:'GFA'}; static INTERNAL : any =  { type:3, value:'INTERNAL'}; static EXTERNAL : any =  { type:3, value:'EXTERNAL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSpatialZoneTypeEnum {
	static CONSTRUCTION : any =  { type:3, value:'CONSTRUCTION'}; static FIRESAFETY : any =  { type:3, value:'FIRESAFETY'}; static LIGHTING : any =  { type:3, value:'LIGHTING'}; static OCCUPANCY : any =  { type:3, value:'OCCUPANCY'}; static SECURITY : any =  { type:3, value:'SECURITY'}; static THERMAL : any =  { type:3, value:'THERMAL'}; static TRANSPORT : any =  { type:3, value:'TRANSPORT'}; static VENTILATION : any =  { type:3, value:'VENTILATION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
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
export class IfcStructuralCurveActivityTypeEnum {
	static CONST : any =  { type:3, value:'CONST'}; static LINEAR : any =  { type:3, value:'LINEAR'}; static POLYGONAL : any =  { type:3, value:'POLYGONAL'}; static EQUIDISTANT : any =  { type:3, value:'EQUIDISTANT'}; static SINUS : any =  { type:3, value:'SINUS'}; static PARABOLA : any =  { type:3, value:'PARABOLA'}; static DISCRETE : any =  { type:3, value:'DISCRETE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcStructuralCurveMemberTypeEnum {
	static RIGID_JOINED_MEMBER : any =  { type:3, value:'RIGID_JOINED_MEMBER'}; static PIN_JOINED_MEMBER : any =  { type:3, value:'PIN_JOINED_MEMBER'}; static CABLE : any =  { type:3, value:'CABLE'}; static TENSION_MEMBER : any =  { type:3, value:'TENSION_MEMBER'}; static COMPRESSION_MEMBER : any =  { type:3, value:'COMPRESSION_MEMBER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcStructuralSurfaceActivityTypeEnum {
	static CONST : any =  { type:3, value:'CONST'}; static BILINEAR : any =  { type:3, value:'BILINEAR'}; static DISCRETE : any =  { type:3, value:'DISCRETE'}; static ISOCONTOUR : any =  { type:3, value:'ISOCONTOUR'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcStructuralSurfaceMemberTypeEnum {
	static BENDING_ELEMENT : any =  { type:3, value:'BENDING_ELEMENT'}; static MEMBRANE_ELEMENT : any =  { type:3, value:'MEMBRANE_ELEMENT'}; static SHELL : any =  { type:3, value:'SHELL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSubContractResourceTypeEnum {
	static PURCHASE : any =  { type:3, value:'PURCHASE'}; static WORK : any =  { type:3, value:'WORK'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSurfaceFeatureTypeEnum {
	static MARK : any =  { type:3, value:'MARK'}; static TAG : any =  { type:3, value:'TAG'}; static TREATMENT : any =  { type:3, value:'TREATMENT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSurfaceSide {
	static POSITIVE : any =  { type:3, value:'POSITIVE'}; static NEGATIVE : any =  { type:3, value:'NEGATIVE'}; static BOTH : any =  { type:3, value:'BOTH'}; 
}
export class IfcSwitchingDeviceTypeEnum {
	static CONTACTOR : any =  { type:3, value:'CONTACTOR'}; static DIMMERSWITCH : any =  { type:3, value:'DIMMERSWITCH'}; static EMERGENCYSTOP : any =  { type:3, value:'EMERGENCYSTOP'}; static KEYPAD : any =  { type:3, value:'KEYPAD'}; static MOMENTARYSWITCH : any =  { type:3, value:'MOMENTARYSWITCH'}; static SELECTORSWITCH : any =  { type:3, value:'SELECTORSWITCH'}; static STARTER : any =  { type:3, value:'STARTER'}; static SWITCHDISCONNECTOR : any =  { type:3, value:'SWITCHDISCONNECTOR'}; static TOGGLESWITCH : any =  { type:3, value:'TOGGLESWITCH'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSystemFurnitureElementTypeEnum {
	static PANEL : any =  { type:3, value:'PANEL'}; static WORKSURFACE : any =  { type:3, value:'WORKSURFACE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTankTypeEnum {
	static BASIN : any =  { type:3, value:'BASIN'}; static BREAKPRESSURE : any =  { type:3, value:'BREAKPRESSURE'}; static EXPANSION : any =  { type:3, value:'EXPANSION'}; static FEEDANDEXPANSION : any =  { type:3, value:'FEEDANDEXPANSION'}; static PRESSUREVESSEL : any =  { type:3, value:'PRESSUREVESSEL'}; static STORAGE : any =  { type:3, value:'STORAGE'}; static VESSEL : any =  { type:3, value:'VESSEL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTaskDurationEnum {
	static ELAPSEDTIME : any =  { type:3, value:'ELAPSEDTIME'}; static WORKTIME : any =  { type:3, value:'WORKTIME'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTaskTypeEnum {
	static ATTENDANCE : any =  { type:3, value:'ATTENDANCE'}; static CONSTRUCTION : any =  { type:3, value:'CONSTRUCTION'}; static DEMOLITION : any =  { type:3, value:'DEMOLITION'}; static DISMANTLE : any =  { type:3, value:'DISMANTLE'}; static DISPOSAL : any =  { type:3, value:'DISPOSAL'}; static INSTALLATION : any =  { type:3, value:'INSTALLATION'}; static LOGISTIC : any =  { type:3, value:'LOGISTIC'}; static MAINTENANCE : any =  { type:3, value:'MAINTENANCE'}; static MOVE : any =  { type:3, value:'MOVE'}; static OPERATION : any =  { type:3, value:'OPERATION'}; static REMOVAL : any =  { type:3, value:'REMOVAL'}; static RENOVATION : any =  { type:3, value:'RENOVATION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTendonAnchorTypeEnum {
	static COUPLER : any =  { type:3, value:'COUPLER'}; static FIXED_END : any =  { type:3, value:'FIXED_END'}; static TENSIONING_END : any =  { type:3, value:'TENSIONING_END'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTendonTypeEnum {
	static BAR : any =  { type:3, value:'BAR'}; static COATED : any =  { type:3, value:'COATED'}; static STRAND : any =  { type:3, value:'STRAND'}; static WIRE : any =  { type:3, value:'WIRE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTextPath {
	static LEFT : any =  { type:3, value:'LEFT'}; static RIGHT : any =  { type:3, value:'RIGHT'}; static UP : any =  { type:3, value:'UP'}; static DOWN : any =  { type:3, value:'DOWN'}; 
}
export class IfcTimeSeriesDataTypeEnum {
	static CONTINUOUS : any =  { type:3, value:'CONTINUOUS'}; static DISCRETE : any =  { type:3, value:'DISCRETE'}; static DISCRETEBINARY : any =  { type:3, value:'DISCRETEBINARY'}; static PIECEWISEBINARY : any =  { type:3, value:'PIECEWISEBINARY'}; static PIECEWISECONSTANT : any =  { type:3, value:'PIECEWISECONSTANT'}; static PIECEWISECONTINUOUS : any =  { type:3, value:'PIECEWISECONTINUOUS'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTransformerTypeEnum {
	static CURRENT : any =  { type:3, value:'CURRENT'}; static FREQUENCY : any =  { type:3, value:'FREQUENCY'}; static INVERTER : any =  { type:3, value:'INVERTER'}; static RECTIFIER : any =  { type:3, value:'RECTIFIER'}; static VOLTAGE : any =  { type:3, value:'VOLTAGE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTransitionCode {
	static DISCONTINUOUS : any =  { type:3, value:'DISCONTINUOUS'}; static CONTINUOUS : any =  { type:3, value:'CONTINUOUS'}; static CONTSAMEGRADIENT : any =  { type:3, value:'CONTSAMEGRADIENT'}; static CONTSAMEGRADIENTSAMECURVATURE : any =  { type:3, value:'CONTSAMEGRADIENTSAMECURVATURE'}; 
}
export class IfcTransportElementTypeEnum {
	static ELEVATOR : any =  { type:3, value:'ELEVATOR'}; static ESCALATOR : any =  { type:3, value:'ESCALATOR'}; static MOVINGWALKWAY : any =  { type:3, value:'MOVINGWALKWAY'}; static CRANEWAY : any =  { type:3, value:'CRANEWAY'}; static LIFTINGGEAR : any =  { type:3, value:'LIFTINGGEAR'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
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
export class IfcUnitaryControlElementTypeEnum {
	static ALARMPANEL : any =  { type:3, value:'ALARMPANEL'}; static CONTROLPANEL : any =  { type:3, value:'CONTROLPANEL'}; static GASDETECTIONPANEL : any =  { type:3, value:'GASDETECTIONPANEL'}; static INDICATORPANEL : any =  { type:3, value:'INDICATORPANEL'}; static MIMICPANEL : any =  { type:3, value:'MIMICPANEL'}; static HUMIDISTAT : any =  { type:3, value:'HUMIDISTAT'}; static THERMOSTAT : any =  { type:3, value:'THERMOSTAT'}; static WEATHERSTATION : any =  { type:3, value:'WEATHERSTATION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcUnitaryEquipmentTypeEnum {
	static AIRHANDLER : any =  { type:3, value:'AIRHANDLER'}; static AIRCONDITIONINGUNIT : any =  { type:3, value:'AIRCONDITIONINGUNIT'}; static DEHUMIDIFIER : any =  { type:3, value:'DEHUMIDIFIER'}; static SPLITSYSTEM : any =  { type:3, value:'SPLITSYSTEM'}; static ROOFTOPUNIT : any =  { type:3, value:'ROOFTOPUNIT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcValveTypeEnum {
	static AIRRELEASE : any =  { type:3, value:'AIRRELEASE'}; static ANTIVACUUM : any =  { type:3, value:'ANTIVACUUM'}; static CHANGEOVER : any =  { type:3, value:'CHANGEOVER'}; static CHECK : any =  { type:3, value:'CHECK'}; static COMMISSIONING : any =  { type:3, value:'COMMISSIONING'}; static DIVERTING : any =  { type:3, value:'DIVERTING'}; static DRAWOFFCOCK : any =  { type:3, value:'DRAWOFFCOCK'}; static DOUBLECHECK : any =  { type:3, value:'DOUBLECHECK'}; static DOUBLEREGULATING : any =  { type:3, value:'DOUBLEREGULATING'}; static FAUCET : any =  { type:3, value:'FAUCET'}; static FLUSHING : any =  { type:3, value:'FLUSHING'}; static GASCOCK : any =  { type:3, value:'GASCOCK'}; static GASTAP : any =  { type:3, value:'GASTAP'}; static ISOLATING : any =  { type:3, value:'ISOLATING'}; static MIXING : any =  { type:3, value:'MIXING'}; static PRESSUREREDUCING : any =  { type:3, value:'PRESSUREREDUCING'}; static PRESSURERELIEF : any =  { type:3, value:'PRESSURERELIEF'}; static REGULATING : any =  { type:3, value:'REGULATING'}; static SAFETYCUTOFF : any =  { type:3, value:'SAFETYCUTOFF'}; static STEAMTRAP : any =  { type:3, value:'STEAMTRAP'}; static STOPCOCK : any =  { type:3, value:'STOPCOCK'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcVibrationIsolatorTypeEnum {
	static COMPRESSION : any =  { type:3, value:'COMPRESSION'}; static SPRING : any =  { type:3, value:'SPRING'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcVoidingFeatureTypeEnum {
	static CUTOUT : any =  { type:3, value:'CUTOUT'}; static NOTCH : any =  { type:3, value:'NOTCH'}; static HOLE : any =  { type:3, value:'HOLE'}; static MITER : any =  { type:3, value:'MITER'}; static CHAMFER : any =  { type:3, value:'CHAMFER'}; static EDGE : any =  { type:3, value:'EDGE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcWallTypeEnum {
	static MOVABLE : any =  { type:3, value:'MOVABLE'}; static PARAPET : any =  { type:3, value:'PARAPET'}; static PARTITIONING : any =  { type:3, value:'PARTITIONING'}; static PLUMBINGWALL : any =  { type:3, value:'PLUMBINGWALL'}; static SHEAR : any =  { type:3, value:'SHEAR'}; static SOLIDWALL : any =  { type:3, value:'SOLIDWALL'}; static STANDARD : any =  { type:3, value:'STANDARD'}; static POLYGONAL : any =  { type:3, value:'POLYGONAL'}; static ELEMENTEDWALL : any =  { type:3, value:'ELEMENTEDWALL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcWasteTerminalTypeEnum {
	static FLOORTRAP : any =  { type:3, value:'FLOORTRAP'}; static FLOORWASTE : any =  { type:3, value:'FLOORWASTE'}; static GULLYSUMP : any =  { type:3, value:'GULLYSUMP'}; static GULLYTRAP : any =  { type:3, value:'GULLYTRAP'}; static ROOFDRAIN : any =  { type:3, value:'ROOFDRAIN'}; static WASTEDISPOSALUNIT : any =  { type:3, value:'WASTEDISPOSALUNIT'}; static WASTETRAP : any =  { type:3, value:'WASTETRAP'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
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
export class IfcWindowTypeEnum {
	static WINDOW : any =  { type:3, value:'WINDOW'}; static SKYLIGHT : any =  { type:3, value:'SKYLIGHT'}; static LIGHTDOME : any =  { type:3, value:'LIGHTDOME'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcWindowTypePartitioningEnum {
	static SINGLE_PANEL : any =  { type:3, value:'SINGLE_PANEL'}; static DOUBLE_PANEL_VERTICAL : any =  { type:3, value:'DOUBLE_PANEL_VERTICAL'}; static DOUBLE_PANEL_HORIZONTAL : any =  { type:3, value:'DOUBLE_PANEL_HORIZONTAL'}; static TRIPLE_PANEL_VERTICAL : any =  { type:3, value:'TRIPLE_PANEL_VERTICAL'}; static TRIPLE_PANEL_BOTTOM : any =  { type:3, value:'TRIPLE_PANEL_BOTTOM'}; static TRIPLE_PANEL_TOP : any =  { type:3, value:'TRIPLE_PANEL_TOP'}; static TRIPLE_PANEL_LEFT : any =  { type:3, value:'TRIPLE_PANEL_LEFT'}; static TRIPLE_PANEL_RIGHT : any =  { type:3, value:'TRIPLE_PANEL_RIGHT'}; static TRIPLE_PANEL_HORIZONTAL : any =  { type:3, value:'TRIPLE_PANEL_HORIZONTAL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcWorkCalendarTypeEnum {
	static FIRSTSHIFT : any =  { type:3, value:'FIRSTSHIFT'}; static SECONDSHIFT : any =  { type:3, value:'SECONDSHIFT'}; static THIRDSHIFT : any =  { type:3, value:'THIRDSHIFT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcWorkPlanTypeEnum {
	static ACTUAL : any =  { type:3, value:'ACTUAL'}; static BASELINE : any =  { type:3, value:'BASELINE'}; static PLANNED : any =  { type:3, value:'PLANNED'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcWorkScheduleTypeEnum {
	static ACTUAL : any =  { type:3, value:'ACTUAL'}; static BASELINE : any =  { type:3, value:'BASELINE'}; static PLANNED : any =  { type:3, value:'PLANNED'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export type IfcActorSelect =  | (Reference<IfcOrganization> | IfcOrganization) | (Reference<IfcPerson> | IfcPerson) | (Reference<IfcPersonAndOrganization> | IfcPersonAndOrganization);
export type IfcAppliedValueSelect =  | (Reference<IfcMeasureWithUnit> | IfcMeasureWithUnit) | (Reference<IfcReference> | IfcReference) | IfcValue;
export type IfcAxis2Placement =  | (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) | (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D);
export type IfcBendingParameterSelect =  | IfcLengthMeasure | IfcPlaneAngleMeasure;
export type IfcBooleanOperand =  | (Reference<IfcBooleanResult> | IfcBooleanResult) | (Reference<IfcCsgPrimitive3D> | IfcCsgPrimitive3D) | (Reference<IfcHalfSpaceSolid> | IfcHalfSpaceSolid) | (Reference<IfcSolidModel> | IfcSolidModel) | (Reference<IfcTessellatedFaceSet> | IfcTessellatedFaceSet);
export type IfcClassificationReferenceSelect =  | (Reference<IfcClassification> | IfcClassification) | (Reference<IfcClassificationReference> | IfcClassificationReference);
export type IfcClassificationSelect =  | (Reference<IfcClassification> | IfcClassification) | (Reference<IfcClassificationReference> | IfcClassificationReference);
export type IfcColour =  | (Reference<IfcColourSpecification> | IfcColourSpecification) | (Reference<IfcPreDefinedColour> | IfcPreDefinedColour);
export type IfcColourOrFactor =  | (Reference<IfcColourRgb> | IfcColourRgb) | IfcNormalisedRatioMeasure;
export type IfcCoordinateReferenceSystemSelect =  | (Reference<IfcCoordinateReferenceSystem> | IfcCoordinateReferenceSystem) | (Reference<IfcGeometricRepresentationContext> | IfcGeometricRepresentationContext);
export type IfcCsgSelect =  | (Reference<IfcBooleanResult> | IfcBooleanResult) | (Reference<IfcCsgPrimitive3D> | IfcCsgPrimitive3D);
export type IfcCurveFontOrScaledCurveFontSelect =  | (Reference<IfcCurveStyleFontAndScaling> | IfcCurveStyleFontAndScaling) | IfcCurveStyleFontSelect;
export type IfcCurveOnSurface =  | (Reference<IfcCompositeCurveOnSurface> | IfcCompositeCurveOnSurface) | (Reference<IfcPcurve> | IfcPcurve) | (Reference<IfcSurfaceCurve> | IfcSurfaceCurve);
export type IfcCurveOrEdgeCurve =  | (Reference<IfcBoundedCurve> | IfcBoundedCurve) | (Reference<IfcEdgeCurve> | IfcEdgeCurve);
export type IfcCurveStyleFontSelect =  | (Reference<IfcCurveStyleFont> | IfcCurveStyleFont) | (Reference<IfcPreDefinedCurveFont> | IfcPreDefinedCurveFont);
export type IfcDefinitionSelect =  | (Reference<IfcObjectDefinition> | IfcObjectDefinition) | (Reference<IfcPropertyDefinition> | IfcPropertyDefinition);
export type IfcDerivedMeasureValue =  | IfcAbsorbedDoseMeasure | IfcAccelerationMeasure | IfcAngularVelocityMeasure | IfcAreaDensityMeasure | IfcCompoundPlaneAngleMeasure | IfcCurvatureMeasure | IfcDoseEquivalentMeasure | IfcDynamicViscosityMeasure | IfcElectricCapacitanceMeasure | IfcElectricChargeMeasure | IfcElectricConductanceMeasure | IfcElectricResistanceMeasure | IfcElectricVoltageMeasure | IfcEnergyMeasure | IfcForceMeasure | IfcFrequencyMeasure | IfcHeatFluxDensityMeasure | IfcHeatingValueMeasure | IfcIlluminanceMeasure | IfcInductanceMeasure | IfcIntegerCountRateMeasure | IfcIonConcentrationMeasure | IfcIsothermalMoistureCapacityMeasure | IfcKinematicViscosityMeasure | IfcLinearForceMeasure | IfcLinearMomentMeasure | IfcLinearStiffnessMeasure | IfcLinearVelocityMeasure | IfcLuminousFluxMeasure | IfcLuminousIntensityDistributionMeasure | IfcMagneticFluxDensityMeasure | IfcMagneticFluxMeasure | IfcMassDensityMeasure | IfcMassFlowRateMeasure | IfcMassPerLengthMeasure | IfcModulusOfElasticityMeasure | IfcModulusOfLinearSubgradeReactionMeasure | IfcModulusOfRotationalSubgradeReactionMeasure | IfcModulusOfSubgradeReactionMeasure | IfcMoistureDiffusivityMeasure | IfcMolecularWeightMeasure | IfcMomentOfInertiaMeasure | IfcMonetaryMeasure | IfcPHMeasure | IfcPlanarForceMeasure | IfcPowerMeasure | IfcPressureMeasure | IfcRadioActivityMeasure | IfcRotationalFrequencyMeasure | IfcRotationalMassMeasure | IfcRotationalStiffnessMeasure | IfcSectionModulusMeasure | IfcSectionalAreaIntegralMeasure | IfcShearModulusMeasure | IfcSoundPowerLevelMeasure | IfcSoundPowerMeasure | IfcSoundPressureLevelMeasure | IfcSoundPressureMeasure | IfcSpecificHeatCapacityMeasure | IfcTemperatureGradientMeasure | IfcTemperatureRateOfChangeMeasure | IfcThermalAdmittanceMeasure | IfcThermalConductivityMeasure | IfcThermalExpansionCoefficientMeasure | IfcThermalResistanceMeasure | IfcThermalTransmittanceMeasure | IfcTorqueMeasure | IfcVaporPermeabilityMeasure | IfcVolumetricFlowRateMeasure | IfcWarpingConstantMeasure | IfcWarpingMomentMeasure;
export type IfcDocumentSelect =  | (Reference<IfcDocumentInformation> | IfcDocumentInformation) | (Reference<IfcDocumentReference> | IfcDocumentReference);
export type IfcFillStyleSelect =  | IfcColour | (Reference<IfcExternallyDefinedHatchStyle> | IfcExternallyDefinedHatchStyle) | (Reference<IfcFillAreaStyleHatching> | IfcFillAreaStyleHatching) | (Reference<IfcFillAreaStyleTiles> | IfcFillAreaStyleTiles);
export type IfcGeometricSetSelect =  | (Reference<IfcCurve> | IfcCurve) | (Reference<IfcPoint> | IfcPoint) | (Reference<IfcSurface> | IfcSurface);
export type IfcGridPlacementDirectionSelect =  | (Reference<IfcDirection> | IfcDirection) | (Reference<IfcVirtualGridIntersection> | IfcVirtualGridIntersection);
export type IfcHatchLineDistanceSelect =  | IfcPositiveLengthMeasure | (Reference<IfcVector> | IfcVector);
export type IfcLayeredItem =  | (Reference<IfcRepresentation> | IfcRepresentation) | (Reference<IfcRepresentationItem> | IfcRepresentationItem);
export type IfcLibrarySelect =  | (Reference<IfcLibraryInformation> | IfcLibraryInformation) | (Reference<IfcLibraryReference> | IfcLibraryReference);
export type IfcLightDistributionDataSourceSelect =  | (Reference<IfcExternalReference> | IfcExternalReference) | (Reference<IfcLightIntensityDistribution> | IfcLightIntensityDistribution);
export type IfcMaterialSelect =  | (Reference<IfcMaterialDefinition> | IfcMaterialDefinition) | (Reference<IfcMaterialList> | IfcMaterialList) | (Reference<IfcMaterialUsageDefinition> | IfcMaterialUsageDefinition);
export type IfcMeasureValue =  | IfcAmountOfSubstanceMeasure | IfcAreaMeasure | IfcComplexNumber | IfcContextDependentMeasure | IfcCountMeasure | IfcDescriptiveMeasure | IfcElectricCurrentMeasure | IfcLengthMeasure | IfcLuminousIntensityMeasure | IfcMassMeasure | IfcNonNegativeLengthMeasure | IfcNormalisedRatioMeasure | IfcNumericMeasure | IfcParameterValue | IfcPlaneAngleMeasure | IfcPositiveLengthMeasure | IfcPositivePlaneAngleMeasure | IfcPositiveRatioMeasure | IfcRatioMeasure | IfcSolidAngleMeasure | IfcThermodynamicTemperatureMeasure | IfcTimeMeasure | IfcVolumeMeasure;
export type IfcMetricValueSelect =  | (Reference<IfcAppliedValue> | IfcAppliedValue) | (Reference<IfcMeasureWithUnit> | IfcMeasureWithUnit) | (Reference<IfcReference> | IfcReference) | (Reference<IfcTable> | IfcTable) | (Reference<IfcTimeSeries> | IfcTimeSeries) | IfcValue;
export type IfcModulusOfRotationalSubgradeReactionSelect =  | IfcBoolean | IfcModulusOfRotationalSubgradeReactionMeasure;
export type IfcModulusOfSubgradeReactionSelect =  | IfcBoolean | IfcModulusOfSubgradeReactionMeasure;
export type IfcModulusOfTranslationalSubgradeReactionSelect =  | IfcBoolean | IfcModulusOfLinearSubgradeReactionMeasure;
export type IfcObjectReferenceSelect =  | (Reference<IfcAddress> | IfcAddress) | (Reference<IfcAppliedValue> | IfcAppliedValue) | (Reference<IfcExternalReference> | IfcExternalReference) | (Reference<IfcMaterialDefinition> | IfcMaterialDefinition) | (Reference<IfcOrganization> | IfcOrganization) | (Reference<IfcPerson> | IfcPerson) | (Reference<IfcPersonAndOrganization> | IfcPersonAndOrganization) | (Reference<IfcTable> | IfcTable) | (Reference<IfcTimeSeries> | IfcTimeSeries);
export type IfcPointOrVertexPoint =  | (Reference<IfcPoint> | IfcPoint) | (Reference<IfcVertexPoint> | IfcVertexPoint);
export type IfcPresentationStyleSelect =  | (Reference<IfcCurveStyle> | IfcCurveStyle) | (Reference<IfcFillAreaStyle> | IfcFillAreaStyle) | IfcNullStyle | (Reference<IfcSurfaceStyle> | IfcSurfaceStyle) | (Reference<IfcTextStyle> | IfcTextStyle);
export type IfcProcessSelect =  | (Reference<IfcProcess> | IfcProcess) | (Reference<IfcTypeProcess> | IfcTypeProcess);
export type IfcProductRepresentationSelect =  | (Reference<IfcProductDefinitionShape> | IfcProductDefinitionShape) | (Reference<IfcRepresentationMap> | IfcRepresentationMap);
export type IfcProductSelect =  | (Reference<IfcProduct> | IfcProduct) | (Reference<IfcTypeProduct> | IfcTypeProduct);
export type IfcPropertySetDefinitionSelect =  | (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition) | IfcPropertySetDefinitionSet;
export type IfcResourceObjectSelect =  | (Reference<IfcActorRole> | IfcActorRole) | (Reference<IfcAppliedValue> | IfcAppliedValue) | (Reference<IfcApproval> | IfcApproval) | (Reference<IfcConstraint> | IfcConstraint) | (Reference<IfcContextDependentUnit> | IfcContextDependentUnit) | (Reference<IfcConversionBasedUnit> | IfcConversionBasedUnit) | (Reference<IfcExternalInformation> | IfcExternalInformation) | (Reference<IfcExternalReference> | IfcExternalReference) | (Reference<IfcMaterialDefinition> | IfcMaterialDefinition) | (Reference<IfcOrganization> | IfcOrganization) | (Reference<IfcPerson> | IfcPerson) | (Reference<IfcPersonAndOrganization> | IfcPersonAndOrganization) | (Reference<IfcPhysicalQuantity> | IfcPhysicalQuantity) | (Reference<IfcProfileDef> | IfcProfileDef) | (Reference<IfcPropertyAbstraction> | IfcPropertyAbstraction) | (Reference<IfcTimeSeries> | IfcTimeSeries);
export type IfcResourceSelect =  | (Reference<IfcResource> | IfcResource) | (Reference<IfcTypeResource> | IfcTypeResource);
export type IfcRotationalStiffnessSelect =  | IfcBoolean | IfcRotationalStiffnessMeasure;
export type IfcSegmentIndexSelect =  | IfcArcIndex | IfcLineIndex;
export type IfcShell =  | (Reference<IfcClosedShell> | IfcClosedShell) | (Reference<IfcOpenShell> | IfcOpenShell);
export type IfcSimpleValue =  | IfcBinary | IfcBoolean | IfcDate | IfcDateTime | IfcDuration | IfcIdentifier | IfcInteger | IfcLabel | IfcLogical | IfcPositiveInteger | IfcReal | IfcText | IfcTime | IfcTimeStamp;
export type IfcSizeSelect =  | IfcDescriptiveMeasure | IfcLengthMeasure | IfcNormalisedRatioMeasure | IfcPositiveLengthMeasure | IfcPositiveRatioMeasure | IfcRatioMeasure;
export type IfcSolidOrShell =  | (Reference<IfcClosedShell> | IfcClosedShell) | (Reference<IfcSolidModel> | IfcSolidModel);
export type IfcSpaceBoundarySelect =  | (Reference<IfcExternalSpatialElement> | IfcExternalSpatialElement) | (Reference<IfcSpace> | IfcSpace);
export type IfcSpecularHighlightSelect =  | IfcSpecularExponent | IfcSpecularRoughness;
export type IfcStructuralActivityAssignmentSelect =  | (Reference<IfcElement> | IfcElement) | (Reference<IfcStructuralItem> | IfcStructuralItem);
export type IfcStyleAssignmentSelect =  | (Reference<IfcPresentationStyle> | IfcPresentationStyle) | (Reference<IfcPresentationStyleAssignment> | IfcPresentationStyleAssignment);
export type IfcSurfaceOrFaceSurface =  | (Reference<IfcFaceBasedSurfaceModel> | IfcFaceBasedSurfaceModel) | (Reference<IfcFaceSurface> | IfcFaceSurface) | (Reference<IfcSurface> | IfcSurface);
export type IfcSurfaceStyleElementSelect =  | (Reference<IfcExternallyDefinedSurfaceStyle> | IfcExternallyDefinedSurfaceStyle) | (Reference<IfcSurfaceStyleLighting> | IfcSurfaceStyleLighting) | (Reference<IfcSurfaceStyleRefraction> | IfcSurfaceStyleRefraction) | (Reference<IfcSurfaceStyleShading> | IfcSurfaceStyleShading) | (Reference<IfcSurfaceStyleWithTextures> | IfcSurfaceStyleWithTextures);
export type IfcTextFontSelect =  | (Reference<IfcExternallyDefinedTextFont> | IfcExternallyDefinedTextFont) | (Reference<IfcPreDefinedTextFont> | IfcPreDefinedTextFont);
export type IfcTimeOrRatioSelect =  | IfcDuration | IfcRatioMeasure;
export type IfcTranslationalStiffnessSelect =  | IfcBoolean | IfcLinearStiffnessMeasure;
export type IfcTrimmingSelect =  | (Reference<IfcCartesianPoint> | IfcCartesianPoint) | IfcParameterValue;
export type IfcUnit =  | (Reference<IfcDerivedUnit> | IfcDerivedUnit) | (Reference<IfcMonetaryUnit> | IfcMonetaryUnit) | (Reference<IfcNamedUnit> | IfcNamedUnit);
export type IfcValue =  | IfcDerivedMeasureValue | IfcMeasureValue | IfcSimpleValue;
export type IfcVectorOrDirection =  | (Reference<IfcDirection> | IfcDirection) | (Reference<IfcVector> | IfcVector);
export type IfcWarpingStiffnessSelect =  | IfcBoolean | IfcWarpingMomentMeasure;
export class IfcActorRole extends IfcLineObject {
	expressID:number=3630933823;
	HasExternalReference!: (Reference<IfcExternalReferenceRelationship> | IfcExternalReferenceRelationship)[] | null;
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
	HasExternalReference!: (Reference<IfcExternalReferenceRelationship> | IfcExternalReferenceRelationship)[] | null;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public AppliedValue: IfcAppliedValueSelect | null, public UnitBasis: (Reference<IfcMeasureWithUnit> | IfcMeasureWithUnit) | null, public ApplicableDate: IfcDate | null, public FixedUntilDate: IfcDate | null, public Category: IfcLabel | null, public Condition: IfcLabel | null, public ArithmeticOperator: IfcArithmeticOperatorEnum | null, public Components: (Reference<IfcAppliedValue> | IfcAppliedValue)[] | null)
	{
		super(expressID);
	}
}
export class IfcApproval extends IfcLineObject {
	expressID:number=130549933;
	HasExternalReferences!: (Reference<IfcExternalReferenceRelationship> | IfcExternalReferenceRelationship)[] | null;
	ApprovedObjects!: (Reference<IfcRelAssociatesApproval> | IfcRelAssociatesApproval)[] | null;
	ApprovedResources!: (Reference<IfcResourceApprovalRelationship> | IfcResourceApprovalRelationship)[] | null;
	IsRelatedWith!: (Reference<IfcApprovalRelationship> | IfcApprovalRelationship)[] | null;
	Relates!: (Reference<IfcApprovalRelationship> | IfcApprovalRelationship)[] | null;
	constructor(expressID: number, public Identifier: IfcIdentifier | null, public Name: IfcLabel | null, public Description: IfcText | null, public TimeOfApproval: IfcDateTime | null, public Status: IfcLabel | null, public Level: IfcLabel | null, public Qualifier: IfcText | null, public RequestingApproval: IfcActorSelect | null, public GivingApproval: IfcActorSelect | null)
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
	constructor(expressID: number, public Name: IfcLabel | null, public TranslationalStiffnessByLengthX: IfcModulusOfTranslationalSubgradeReactionSelect | null, public TranslationalStiffnessByLengthY: IfcModulusOfTranslationalSubgradeReactionSelect | null, public TranslationalStiffnessByLengthZ: IfcModulusOfTranslationalSubgradeReactionSelect | null, public RotationalStiffnessByLengthX: IfcModulusOfRotationalSubgradeReactionSelect | null, public RotationalStiffnessByLengthY: IfcModulusOfRotationalSubgradeReactionSelect | null, public RotationalStiffnessByLengthZ: IfcModulusOfRotationalSubgradeReactionSelect | null)
	{
		super(expressID,Name);
	}
}
export class IfcBoundaryFaceCondition extends IfcBoundaryCondition {
	expressID:number=3367102660;
	constructor(expressID: number, public Name: IfcLabel | null, public TranslationalStiffnessByAreaX: IfcModulusOfSubgradeReactionSelect | null, public TranslationalStiffnessByAreaY: IfcModulusOfSubgradeReactionSelect | null, public TranslationalStiffnessByAreaZ: IfcModulusOfSubgradeReactionSelect | null)
	{
		super(expressID,Name);
	}
}
export class IfcBoundaryNodeCondition extends IfcBoundaryCondition {
	expressID:number=1387855156;
	constructor(expressID: number, public Name: IfcLabel | null, public TranslationalStiffnessX: IfcTranslationalStiffnessSelect | null, public TranslationalStiffnessY: IfcTranslationalStiffnessSelect | null, public TranslationalStiffnessZ: IfcTranslationalStiffnessSelect | null, public RotationalStiffnessX: IfcRotationalStiffnessSelect | null, public RotationalStiffnessY: IfcRotationalStiffnessSelect | null, public RotationalStiffnessZ: IfcRotationalStiffnessSelect | null)
	{
		super(expressID,Name);
	}
}
export class IfcBoundaryNodeConditionWarping extends IfcBoundaryNodeCondition {
	expressID:number=2069777674;
	constructor(expressID: number, public Name: IfcLabel | null, public TranslationalStiffnessX: IfcTranslationalStiffnessSelect | null, public TranslationalStiffnessY: IfcTranslationalStiffnessSelect | null, public TranslationalStiffnessZ: IfcTranslationalStiffnessSelect | null, public RotationalStiffnessX: IfcRotationalStiffnessSelect | null, public RotationalStiffnessY: IfcRotationalStiffnessSelect | null, public RotationalStiffnessZ: IfcRotationalStiffnessSelect | null, public WarpingStiffness: IfcWarpingStiffnessSelect | null)
	{
		super(expressID,Name, TranslationalStiffnessX, TranslationalStiffnessY, TranslationalStiffnessZ, RotationalStiffnessX, RotationalStiffnessY, RotationalStiffnessZ);
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
export class IfcConnectionSurfaceGeometry extends IfcConnectionGeometry {
	expressID:number=2732653382;
	constructor(expressID: number, public SurfaceOnRelatingElement: IfcSurfaceOrFaceSurface , public SurfaceOnRelatedElement: IfcSurfaceOrFaceSurface | null)
	{
			super(expressID);
	}
}
export class IfcConnectionVolumeGeometry extends IfcConnectionGeometry {
	expressID:number=775493141;
	constructor(expressID: number, public VolumeOnRelatingElement: IfcSolidOrShell , public VolumeOnRelatedElement: IfcSolidOrShell | null)
	{
			super(expressID);
	}
}
export class IfcConstraint extends IfcLineObject {
	expressID:number=1959218052;
	HasExternalReferences!: (Reference<IfcExternalReferenceRelationship> | IfcExternalReferenceRelationship)[] | null;
	PropertiesForConstraint!: (Reference<IfcResourceConstraintRelationship> | IfcResourceConstraintRelationship)[] | null;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public ConstraintGrade: IfcConstraintEnum , public ConstraintSource: IfcLabel | null, public CreatingActor: IfcActorSelect | null, public CreationTime: IfcDateTime | null, public UserDefinedGrade: IfcLabel | null)
	{
		super(expressID);
	}
}
export class IfcCoordinateOperation extends IfcLineObject {
	expressID:number=1785450214;
	constructor(expressID: number, public SourceCRS: IfcCoordinateReferenceSystemSelect , public TargetCRS: (Reference<IfcCoordinateReferenceSystem> | IfcCoordinateReferenceSystem) )
	{
		super(expressID);
	}
}
export class IfcCoordinateReferenceSystem extends IfcLineObject {
	expressID:number=1466758467;
	HasCoordinateOperation!: (Reference<IfcCoordinateOperation> | IfcCoordinateOperation)[] | null;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public GeodeticDatum: IfcIdentifier | null, public VerticalDatum: IfcIdentifier | null)
	{
		super(expressID);
	}
}
export class IfcCostValue extends IfcAppliedValue {
	expressID:number=602808272;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public AppliedValue: IfcAppliedValueSelect | null, public UnitBasis: (Reference<IfcMeasureWithUnit> | IfcMeasureWithUnit) | null, public ApplicableDate: IfcDate | null, public FixedUntilDate: IfcDate | null, public Category: IfcLabel | null, public Condition: IfcLabel | null, public ArithmeticOperator: IfcArithmeticOperatorEnum | null, public Components: (Reference<IfcAppliedValue> | IfcAppliedValue)[] | null)
	{
		super(expressID,Name, Description, AppliedValue, UnitBasis, ApplicableDate, FixedUntilDate, Category, Condition, ArithmeticOperator, Components);
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
export class IfcExternalInformation extends IfcLineObject {
	expressID:number=4294318154;
	constructor(expressID: number, )
	{
		super(expressID);
	}
}
export class IfcExternalReference extends IfcLineObject {
	expressID:number=3200245327;
	ExternalReferenceForResources!: (Reference<IfcExternalReferenceRelationship> | IfcExternalReferenceRelationship)[] | null;
	constructor(expressID: number, public Location: IfcURIReference | null, public Identification: IfcIdentifier | null, public Name: IfcLabel | null)
	{
		super(expressID);
	}
}
export class IfcExternallyDefinedHatchStyle extends IfcExternalReference {
	expressID:number=2242383968;
	constructor(expressID: number, public Location: IfcURIReference | null, public Identification: IfcIdentifier | null, public Name: IfcLabel | null)
	{
		super(expressID,Location, Identification, Name);
	}
}
export class IfcExternallyDefinedSurfaceStyle extends IfcExternalReference {
	expressID:number=1040185647;
	constructor(expressID: number, public Location: IfcURIReference | null, public Identification: IfcIdentifier | null, public Name: IfcLabel | null)
	{
		super(expressID,Location, Identification, Name);
	}
}
export class IfcExternallyDefinedTextFont extends IfcExternalReference {
	expressID:number=3548104201;
	constructor(expressID: number, public Location: IfcURIReference | null, public Identification: IfcIdentifier | null, public Name: IfcLabel | null)
	{
		super(expressID,Location, Identification, Name);
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
	constructor(expressID: number, public TimeStamp: IfcDateTime , public ListValues: IfcValue[] )
	{
		super(expressID);
	}
}
export class IfcLibraryInformation extends IfcExternalInformation {
	expressID:number=2655187982;
	LibraryInfoForObjects!: (Reference<IfcRelAssociatesLibrary> | IfcRelAssociatesLibrary)[] | null;
	HasLibraryReferences!: (Reference<IfcLibraryReference> | IfcLibraryReference)[] | null;
	constructor(expressID: number, public Name: IfcLabel , public Version: IfcLabel | null, public Publisher: IfcActorSelect | null, public VersionDate: IfcDateTime | null, public Location: IfcURIReference | null, public Description: IfcText | null)
	{
			super(expressID);
	}
}
export class IfcLibraryReference extends IfcExternalReference {
	expressID:number=3452421091;
	LibraryRefForObjects!: (Reference<IfcRelAssociatesLibrary> | IfcRelAssociatesLibrary)[] | null;
	constructor(expressID: number, public Location: IfcURIReference | null, public Identification: IfcIdentifier | null, public Name: IfcLabel | null, public Description: IfcText | null, public Language: IfcLanguageId | null, public ReferencedLibrary: (Reference<IfcLibraryInformation> | IfcLibraryInformation) | null)
	{
		super(expressID,Location, Identification, Name);
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
export class IfcMapConversion extends IfcCoordinateOperation {
	expressID:number=3057273783;
	constructor(expressID: number, public SourceCRS: IfcCoordinateReferenceSystemSelect , public TargetCRS: (Reference<IfcCoordinateReferenceSystem> | IfcCoordinateReferenceSystem) , public Eastings: IfcLengthMeasure , public Northings: IfcLengthMeasure , public OrthogonalHeight: IfcLengthMeasure , public XAxisAbscissa: IfcReal | null, public XAxisOrdinate: IfcReal | null, public Scale: IfcReal | null)
	{
		super(expressID,SourceCRS, TargetCRS);
	}
}
export class IfcMaterialClassificationRelationship extends IfcLineObject {
	expressID:number=1847130766;
	constructor(expressID: number, public MaterialClassifications: IfcClassificationSelect[] , public ClassifiedMaterial: (Reference<IfcMaterial> | IfcMaterial) )
	{
		super(expressID);
	}
}
export class IfcMaterialDefinition extends IfcLineObject {
	expressID:number=760658860;
	AssociatedTo!: (Reference<IfcRelAssociatesMaterial> | IfcRelAssociatesMaterial)[] | null;
	HasExternalReferences!: (Reference<IfcExternalReferenceRelationship> | IfcExternalReferenceRelationship)[] | null;
	HasProperties!: (Reference<IfcMaterialProperties> | IfcMaterialProperties)[] | null;
	constructor(expressID: number, )
	{
		super(expressID);
	}
}
export class IfcMaterialLayer extends IfcMaterialDefinition {
	expressID:number=248100487;
	ToMaterialLayerSet!: (Reference<IfcMaterialLayerSet> | IfcMaterialLayerSet) | null;
	constructor(expressID: number, public Material: (Reference<IfcMaterial> | IfcMaterial) | null, public LayerThickness: IfcNonNegativeLengthMeasure , public IsVentilated: IfcLogical | null, public Name: IfcLabel | null, public Description: IfcText | null, public Category: IfcLabel | null, public Priority: IfcInteger | null)
	{
			super(expressID);
	}
}
export class IfcMaterialLayerSet extends IfcMaterialDefinition {
	expressID:number=3303938423;
	constructor(expressID: number, public MaterialLayers: (Reference<IfcMaterialLayer> | IfcMaterialLayer)[] , public LayerSetName: IfcLabel | null, public Description: IfcText | null)
	{
			super(expressID);
	}
}
export class IfcMaterialLayerWithOffsets extends IfcMaterialLayer {
	expressID:number=1847252529;
	constructor(expressID: number, public Material: (Reference<IfcMaterial> | IfcMaterial) | null, public LayerThickness: IfcNonNegativeLengthMeasure , public IsVentilated: IfcLogical | null, public Name: IfcLabel | null, public Description: IfcText | null, public Category: IfcLabel | null, public Priority: IfcInteger | null, public OffsetDirection: IfcLayerSetDirectionEnum , public OffsetValues: IfcLengthMeasure )
	{
		super(expressID,Material, LayerThickness, IsVentilated, Name, Description, Category, Priority);
	}
}
export class IfcMaterialList extends IfcLineObject {
	expressID:number=2199411900;
	constructor(expressID: number, public Materials: (Reference<IfcMaterial> | IfcMaterial)[] )
	{
		super(expressID);
	}
}
export class IfcMaterialProfile extends IfcMaterialDefinition {
	expressID:number=2235152071;
	ToMaterialProfileSet!: (Reference<IfcMaterialProfileSet> | IfcMaterialProfileSet) | null;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public Material: (Reference<IfcMaterial> | IfcMaterial) | null, public Profile: (Reference<IfcProfileDef> | IfcProfileDef) , public Priority: IfcInteger | null, public Category: IfcLabel | null)
	{
			super(expressID);
	}
}
export class IfcMaterialProfileSet extends IfcMaterialDefinition {
	expressID:number=164193824;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public MaterialProfiles: (Reference<IfcMaterialProfile> | IfcMaterialProfile)[] , public CompositeProfile: (Reference<IfcCompositeProfileDef> | IfcCompositeProfileDef) | null)
	{
			super(expressID);
	}
}
export class IfcMaterialProfileWithOffsets extends IfcMaterialProfile {
	expressID:number=552965576;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public Material: (Reference<IfcMaterial> | IfcMaterial) | null, public Profile: (Reference<IfcProfileDef> | IfcProfileDef) , public Priority: IfcInteger | null, public Category: IfcLabel | null, public OffsetValues: IfcLengthMeasure )
	{
		super(expressID,Name, Description, Material, Profile, Priority, Category);
	}
}
export class IfcMaterialUsageDefinition extends IfcLineObject {
	expressID:number=1507914824;
	AssociatedTo!: (Reference<IfcRelAssociatesMaterial> | IfcRelAssociatesMaterial)[] | null;
	constructor(expressID: number, )
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
export class IfcMetric extends IfcConstraint {
	expressID:number=3368373690;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public ConstraintGrade: IfcConstraintEnum , public ConstraintSource: IfcLabel | null, public CreatingActor: IfcActorSelect | null, public CreationTime: IfcDateTime | null, public UserDefinedGrade: IfcLabel | null, public Benchmark: IfcBenchmarkEnum , public ValueSource: IfcLabel | null, public DataValue: IfcMetricValueSelect | null, public ReferencePath: (Reference<IfcReference> | IfcReference) | null)
	{
		super(expressID,Name, Description, ConstraintGrade, ConstraintSource, CreatingActor, CreationTime, UserDefinedGrade);
	}
}
export class IfcMonetaryUnit extends IfcLineObject {
	expressID:number=2706619895;
	constructor(expressID: number, public Currency: IfcLabel )
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
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public ConstraintGrade: IfcConstraintEnum , public ConstraintSource: IfcLabel | null, public CreatingActor: IfcActorSelect | null, public CreationTime: IfcDateTime | null, public UserDefinedGrade: IfcLabel | null, public BenchmarkValues: (Reference<IfcConstraint> | IfcConstraint)[] | null, public LogicalAggregator: IfcLogicalOperatorEnum | null, public ObjectiveQualifier: IfcObjectiveEnum , public UserDefinedQualifier: IfcLabel | null)
	{
		super(expressID,Name, Description, ConstraintGrade, ConstraintSource, CreatingActor, CreationTime, UserDefinedGrade);
	}
}
export class IfcOrganization extends IfcLineObject {
	expressID:number=4251960020;
	IsRelatedBy!: (Reference<IfcOrganizationRelationship> | IfcOrganizationRelationship)[] | null;
	Relates!: (Reference<IfcOrganizationRelationship> | IfcOrganizationRelationship)[] | null;
	Engages!: (Reference<IfcPersonAndOrganization> | IfcPersonAndOrganization)[] | null;
	constructor(expressID: number, public Identification: IfcIdentifier | null, public Name: IfcLabel , public Description: IfcText | null, public Roles: (Reference<IfcActorRole> | IfcActorRole)[] | null, public Addresses: (Reference<IfcAddress> | IfcAddress)[] | null)
	{
		super(expressID);
	}
}
export class IfcOwnerHistory extends IfcLineObject {
	expressID:number=1207048766;
	constructor(expressID: number, public OwningUser: (Reference<IfcPersonAndOrganization> | IfcPersonAndOrganization) , public OwningApplication: (Reference<IfcApplication> | IfcApplication) , public State: IfcStateEnum | null, public ChangeAction: IfcChangeActionEnum | null, public LastModifiedDate: IfcTimeStamp | null, public LastModifyingUser: (Reference<IfcPersonAndOrganization> | IfcPersonAndOrganization) | null, public LastModifyingApplication: (Reference<IfcApplication> | IfcApplication) | null, public CreationDate: IfcTimeStamp )
	{
		super(expressID);
	}
}
export class IfcPerson extends IfcLineObject {
	expressID:number=2077209135;
	EngagedIn!: (Reference<IfcPersonAndOrganization> | IfcPersonAndOrganization)[] | null;
	constructor(expressID: number, public Identification: IfcIdentifier | null, public FamilyName: IfcLabel | null, public GivenName: IfcLabel | null, public MiddleNames: IfcLabel[] | null, public PrefixTitles: IfcLabel[] | null, public SuffixTitles: IfcLabel[] | null, public Roles: (Reference<IfcActorRole> | IfcActorRole)[] | null, public Addresses: (Reference<IfcAddress> | IfcAddress)[] | null)
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
	HasExternalReferences!: (Reference<IfcExternalReferenceRelationship> | IfcExternalReferenceRelationship)[] | null;
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
export class IfcPresentationItem extends IfcLineObject {
	expressID:number=677532197;
	constructor(expressID: number, )
	{
		super(expressID);
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
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public AssignedItems: IfcLayeredItem[] , public Identifier: IfcIdentifier | null, public LayerOn: IfcLogical , public LayerFrozen: IfcLogical , public LayerBlocked: IfcLogical , public LayerStyles: (Reference<IfcPresentationStyle> | IfcPresentationStyle)[] )
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
export class IfcProfileDef extends IfcLineObject {
	expressID:number=3958567839;
	HasExternalReference!: (Reference<IfcExternalReferenceRelationship> | IfcExternalReferenceRelationship)[] | null;
	HasProperties!: (Reference<IfcProfileProperties> | IfcProfileProperties)[] | null;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null)
	{
		super(expressID);
	}
}
export class IfcProjectedCRS extends IfcCoordinateReferenceSystem {
	expressID:number=3843373140;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public GeodeticDatum: IfcIdentifier | null, public VerticalDatum: IfcIdentifier | null, public MapProjection: IfcIdentifier | null, public MapZone: IfcIdentifier | null, public MapUnit: (Reference<IfcNamedUnit> | IfcNamedUnit) | null)
	{
		super(expressID,Name, Description, GeodeticDatum, VerticalDatum);
	}
}
export class IfcPropertyAbstraction extends IfcLineObject {
	expressID:number=986844984;
	HasExternalReferences!: (Reference<IfcExternalReferenceRelationship> | IfcExternalReferenceRelationship)[] | null;
	constructor(expressID: number, )
	{
		super(expressID);
	}
}
export class IfcPropertyEnumeration extends IfcPropertyAbstraction {
	expressID:number=3710013099;
	constructor(expressID: number, public Name: IfcLabel , public EnumerationValues: IfcValue[] , public Unit: IfcUnit | null)
	{
			super(expressID);
	}
}
export class IfcQuantityArea extends IfcPhysicalSimpleQuantity {
	expressID:number=2044713172;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public Unit: (Reference<IfcNamedUnit> | IfcNamedUnit) | null, public AreaValue: IfcAreaMeasure , public Formula: IfcLabel | null)
	{
		super(expressID,Name, Description, Unit);
	}
}
export class IfcQuantityCount extends IfcPhysicalSimpleQuantity {
	expressID:number=2093928680;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public Unit: (Reference<IfcNamedUnit> | IfcNamedUnit) | null, public CountValue: IfcCountMeasure , public Formula: IfcLabel | null)
	{
		super(expressID,Name, Description, Unit);
	}
}
export class IfcQuantityLength extends IfcPhysicalSimpleQuantity {
	expressID:number=931644368;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public Unit: (Reference<IfcNamedUnit> | IfcNamedUnit) | null, public LengthValue: IfcLengthMeasure , public Formula: IfcLabel | null)
	{
		super(expressID,Name, Description, Unit);
	}
}
export class IfcQuantityTime extends IfcPhysicalSimpleQuantity {
	expressID:number=3252649465;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public Unit: (Reference<IfcNamedUnit> | IfcNamedUnit) | null, public TimeValue: IfcTimeMeasure , public Formula: IfcLabel | null)
	{
		super(expressID,Name, Description, Unit);
	}
}
export class IfcQuantityVolume extends IfcPhysicalSimpleQuantity {
	expressID:number=2405470396;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public Unit: (Reference<IfcNamedUnit> | IfcNamedUnit) | null, public VolumeValue: IfcVolumeMeasure , public Formula: IfcLabel | null)
	{
		super(expressID,Name, Description, Unit);
	}
}
export class IfcQuantityWeight extends IfcPhysicalSimpleQuantity {
	expressID:number=825690147;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public Unit: (Reference<IfcNamedUnit> | IfcNamedUnit) | null, public WeightValue: IfcMassMeasure , public Formula: IfcLabel | null)
	{
		super(expressID,Name, Description, Unit);
	}
}
export class IfcRecurrencePattern extends IfcLineObject {
	expressID:number=3915482550;
	constructor(expressID: number, public RecurrenceType: IfcRecurrenceTypeEnum , public DayComponent: IfcDayInMonthNumber[] | null, public WeekdayComponent: IfcDayInWeekNumber[] | null, public MonthComponent: IfcMonthInYearNumber[] | null, public Position: IfcInteger | null, public Interval: IfcInteger | null, public Occurrences: IfcInteger | null, public TimePeriods: (Reference<IfcTimePeriod> | IfcTimePeriod)[] | null)
	{
		super(expressID);
	}
}
export class IfcReference extends IfcLineObject {
	expressID:number=2433181523;
	constructor(expressID: number, public TypeIdentifier: IfcIdentifier | null, public AttributeIdentifier: IfcIdentifier | null, public InstanceName: IfcLabel | null, public ListPositions: IfcInteger[] | null, public InnerReference: (Reference<IfcReference> | IfcReference) | null)
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
	LayerAssignment!: (Reference<IfcPresentationLayerAssignment> | IfcPresentationLayerAssignment)[] | null;
	StyledByItem!: (Reference<IfcStyledItem> | IfcStyledItem)[] | null;
	constructor(expressID: number, )
	{
		super(expressID);
	}
}
export class IfcRepresentationMap extends IfcLineObject {
	expressID:number=1660063152;
	HasShapeAspects!: (Reference<IfcShapeAspect> | IfcShapeAspect)[] | null;
	MapUsage!: (Reference<IfcMappedItem> | IfcMappedItem)[] | null;
	constructor(expressID: number, public MappingOrigin: IfcAxis2Placement , public MappedRepresentation: (Reference<IfcRepresentation> | IfcRepresentation) )
	{
		super(expressID);
	}
}
export class IfcResourceLevelRelationship extends IfcLineObject {
	expressID:number=2439245199;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null)
	{
		super(expressID);
	}
}
export class IfcRoot extends IfcLineObject {
	expressID:number=2341007311;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null)
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
export class IfcSchedulingTime extends IfcLineObject {
	expressID:number=1054537805;
	constructor(expressID: number, public Name: IfcLabel | null, public DataOrigin: IfcDataOriginEnum | null, public UserDefinedDataOrigin: IfcLabel | null)
	{
		super(expressID);
	}
}
export class IfcShapeAspect extends IfcLineObject {
	expressID:number=867548509;
	constructor(expressID: number, public ShapeRepresentations: (Reference<IfcShapeModel> | IfcShapeModel)[] , public Name: IfcLabel | null, public Description: IfcText | null, public ProductDefinitional: IfcLogical , public PartOfProductDefinitionShape: IfcProductRepresentationSelect | null)
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
export class IfcStructuralLoadConfiguration extends IfcStructuralLoad {
	expressID:number=3478079324;
	constructor(expressID: number, public Name: IfcLabel | null, public Values: (Reference<IfcStructuralLoadOrResult> | IfcStructuralLoadOrResult)[] , public Locations: IfcLengthMeasure[] | null)
	{
		super(expressID,Name);
	}
}
export class IfcStructuralLoadOrResult extends IfcStructuralLoad {
	expressID:number=609421318;
	constructor(expressID: number, public Name: IfcLabel | null)
	{
		super(expressID,Name);
	}
}
export class IfcStructuralLoadStatic extends IfcStructuralLoadOrResult {
	expressID:number=2525727697;
	constructor(expressID: number, public Name: IfcLabel | null)
	{
		super(expressID,Name);
	}
}
export class IfcStructuralLoadTemperature extends IfcStructuralLoadStatic {
	expressID:number=3408363356;
	constructor(expressID: number, public Name: IfcLabel | null, public DeltaTConstant: IfcThermodynamicTemperatureMeasure | null, public DeltaTY: IfcThermodynamicTemperatureMeasure | null, public DeltaTZ: IfcThermodynamicTemperatureMeasure | null)
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
	constructor(expressID: number, public Item: (Reference<IfcRepresentationItem> | IfcRepresentationItem) | null, public Styles: IfcStyleAssignmentSelect[] , public Name: IfcLabel | null)
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
export class IfcSurfaceReinforcementArea extends IfcStructuralLoadOrResult {
	expressID:number=2934153892;
	constructor(expressID: number, public Name: IfcLabel | null, public SurfaceReinforcement1: IfcLengthMeasure[] | null, public SurfaceReinforcement2: IfcLengthMeasure[] | null, public ShearReinforcement: IfcRatioMeasure | null)
	{
		super(expressID,Name);
	}
}
export class IfcSurfaceStyle extends IfcPresentationStyle {
	expressID:number=1300840506;
	constructor(expressID: number, public Name: IfcLabel | null, public Side: IfcSurfaceSide , public Styles: IfcSurfaceStyleElementSelect[] )
	{
		super(expressID,Name);
	}
}
export class IfcSurfaceStyleLighting extends IfcPresentationItem {
	expressID:number=3303107099;
	constructor(expressID: number, public DiffuseTransmissionColour: (Reference<IfcColourRgb> | IfcColourRgb) , public DiffuseReflectionColour: (Reference<IfcColourRgb> | IfcColourRgb) , public TransmissionColour: (Reference<IfcColourRgb> | IfcColourRgb) , public ReflectanceColour: (Reference<IfcColourRgb> | IfcColourRgb) )
	{
			super(expressID);
	}
}
export class IfcSurfaceStyleRefraction extends IfcPresentationItem {
	expressID:number=1607154358;
	constructor(expressID: number, public RefractionIndex: IfcReal | null, public DispersionFactor: IfcReal | null)
	{
			super(expressID);
	}
}
export class IfcSurfaceStyleShading extends IfcPresentationItem {
	expressID:number=846575682;
	constructor(expressID: number, public SurfaceColour: (Reference<IfcColourRgb> | IfcColourRgb) , public Transparency: IfcNormalisedRatioMeasure | null)
	{
			super(expressID);
	}
}
export class IfcSurfaceStyleWithTextures extends IfcPresentationItem {
	expressID:number=1351298697;
	constructor(expressID: number, public Textures: (Reference<IfcSurfaceTexture> | IfcSurfaceTexture)[] )
	{
			super(expressID);
	}
}
export class IfcSurfaceTexture extends IfcPresentationItem {
	expressID:number=626085974;
	IsMappedBy!: (Reference<IfcTextureCoordinate> | IfcTextureCoordinate)[] | null;
	UsedInStyles!: (Reference<IfcSurfaceStyleWithTextures> | IfcSurfaceStyleWithTextures)[] | null;
	constructor(expressID: number, public RepeatS: IfcBoolean , public RepeatT: IfcBoolean , public Mode: IfcIdentifier | null, public TextureTransform: (Reference<IfcCartesianTransformationOperator2D> | IfcCartesianTransformationOperator2D) | null, public Parameter: IfcIdentifier[] | null)
	{
			super(expressID);
	}
}
export class IfcTable extends IfcLineObject {
	expressID:number=985171141;
	constructor(expressID: number, public Name: IfcLabel | null, public Rows: (Reference<IfcTableRow> | IfcTableRow)[] | null, public Columns: (Reference<IfcTableColumn> | IfcTableColumn)[] | null)
	{
		super(expressID);
	}
}
export class IfcTableColumn extends IfcLineObject {
	expressID:number=2043862942;
	constructor(expressID: number, public Identifier: IfcIdentifier | null, public Name: IfcLabel | null, public Description: IfcText | null, public Unit: IfcUnit | null, public ReferencePath: (Reference<IfcReference> | IfcReference) | null)
	{
		super(expressID);
	}
}
export class IfcTableRow extends IfcLineObject {
	expressID:number=531007025;
	constructor(expressID: number, public RowCells: IfcValue[] | null, public IsHeading: IfcBoolean | null)
	{
		super(expressID);
	}
}
export class IfcTaskTime extends IfcSchedulingTime {
	expressID:number=1549132990;
	constructor(expressID: number, public Name: IfcLabel | null, public DataOrigin: IfcDataOriginEnum | null, public UserDefinedDataOrigin: IfcLabel | null, public DurationType: IfcTaskDurationEnum | null, public ScheduleDuration: IfcDuration | null, public ScheduleStart: IfcDateTime | null, public ScheduleFinish: IfcDateTime | null, public EarlyStart: IfcDateTime | null, public EarlyFinish: IfcDateTime | null, public LateStart: IfcDateTime | null, public LateFinish: IfcDateTime | null, public FreeFloat: IfcDuration | null, public TotalFloat: IfcDuration | null, public IsCritical: IfcBoolean | null, public StatusTime: IfcDateTime | null, public ActualDuration: IfcDuration | null, public ActualStart: IfcDateTime | null, public ActualFinish: IfcDateTime | null, public RemainingTime: IfcDuration | null, public Completion: IfcPositiveRatioMeasure | null)
	{
		super(expressID,Name, DataOrigin, UserDefinedDataOrigin);
	}
}
export class IfcTaskTimeRecurring extends IfcTaskTime {
	expressID:number=2771591690;
	constructor(expressID: number, public Name: IfcLabel | null, public DataOrigin: IfcDataOriginEnum | null, public UserDefinedDataOrigin: IfcLabel | null, public DurationType: IfcTaskDurationEnum | null, public ScheduleDuration: IfcDuration | null, public ScheduleStart: IfcDateTime | null, public ScheduleFinish: IfcDateTime | null, public EarlyStart: IfcDateTime | null, public EarlyFinish: IfcDateTime | null, public LateStart: IfcDateTime | null, public LateFinish: IfcDateTime | null, public FreeFloat: IfcDuration | null, public TotalFloat: IfcDuration | null, public IsCritical: IfcBoolean | null, public StatusTime: IfcDateTime | null, public ActualDuration: IfcDuration | null, public ActualStart: IfcDateTime | null, public ActualFinish: IfcDateTime | null, public RemainingTime: IfcDuration | null, public Completion: IfcPositiveRatioMeasure | null, public Recurrence: (Reference<IfcRecurrencePattern> | IfcRecurrencePattern) )
	{
		super(expressID,Name, DataOrigin, UserDefinedDataOrigin, DurationType, ScheduleDuration, ScheduleStart, ScheduleFinish, EarlyStart, EarlyFinish, LateStart, LateFinish, FreeFloat, TotalFloat, IsCritical, StatusTime, ActualDuration, ActualStart, ActualFinish, RemainingTime, Completion);
	}
}
export class IfcTelecomAddress extends IfcAddress {
	expressID:number=912023232;
	constructor(expressID: number, public Purpose: IfcAddressTypeEnum | null, public Description: IfcText | null, public UserDefinedPurpose: IfcLabel | null, public TelephoneNumbers: IfcLabel[] | null, public FacsimileNumbers: IfcLabel[] | null, public PagerNumber: IfcLabel | null, public ElectronicMailAddresses: IfcLabel[] | null, public WWWHomePageURL: IfcURIReference | null, public MessagingIDs: IfcURIReference[] | null)
	{
		super(expressID,Purpose, Description, UserDefinedPurpose);
	}
}
export class IfcTextStyle extends IfcPresentationStyle {
	expressID:number=1447204868;
	constructor(expressID: number, public Name: IfcLabel | null, public TextCharacterAppearance: (Reference<IfcTextStyleForDefinedFont> | IfcTextStyleForDefinedFont) | null, public TextStyle: (Reference<IfcTextStyleTextModel> | IfcTextStyleTextModel) | null, public TextFontStyle: IfcTextFontSelect , public ModelOrDraughting: IfcBoolean | null)
	{
		super(expressID,Name);
	}
}
export class IfcTextStyleForDefinedFont extends IfcPresentationItem {
	expressID:number=2636378356;
	constructor(expressID: number, public Colour: IfcColour , public BackgroundColour: IfcColour | null)
	{
			super(expressID);
	}
}
export class IfcTextStyleTextModel extends IfcPresentationItem {
	expressID:number=1640371178;
	constructor(expressID: number, public TextIndent: IfcSizeSelect | null, public TextAlign: IfcTextAlignment | null, public TextDecoration: IfcTextDecoration | null, public LetterSpacing: IfcSizeSelect | null, public WordSpacing: IfcSizeSelect | null, public TextTransform: IfcTextTransformation | null, public LineHeight: IfcSizeSelect | null)
	{
			super(expressID);
	}
}
export class IfcTextureCoordinate extends IfcPresentationItem {
	expressID:number=280115917;
	constructor(expressID: number, public Maps: (Reference<IfcSurfaceTexture> | IfcSurfaceTexture)[] )
	{
			super(expressID);
	}
}
export class IfcTextureCoordinateGenerator extends IfcTextureCoordinate {
	expressID:number=1742049831;
	constructor(expressID: number, public Maps: (Reference<IfcSurfaceTexture> | IfcSurfaceTexture)[] , public Mode: IfcLabel , public Parameter: IfcReal[] | null)
	{
		super(expressID,Maps);
	}
}
export class IfcTextureMap extends IfcTextureCoordinate {
	expressID:number=2552916305;
	constructor(expressID: number, public Maps: (Reference<IfcSurfaceTexture> | IfcSurfaceTexture)[] , public Vertices: (Reference<IfcTextureVertex> | IfcTextureVertex)[] , public MappedTo: (Reference<IfcFace> | IfcFace) )
	{
		super(expressID,Maps);
	}
}
export class IfcTextureVertex extends IfcPresentationItem {
	expressID:number=1210645708;
	constructor(expressID: number, public Coordinates: IfcParameterValue[] )
	{
			super(expressID);
	}
}
export class IfcTextureVertexList extends IfcPresentationItem {
	expressID:number=3611470254;
	constructor(expressID: number, public TexCoordsList: IfcParameterValue[] )
	{
			super(expressID);
	}
}
export class IfcTimePeriod extends IfcLineObject {
	expressID:number=1199560280;
	constructor(expressID: number, public StartTime: IfcTime , public EndTime: IfcTime )
	{
		super(expressID);
	}
}
export class IfcTimeSeries extends IfcLineObject {
	expressID:number=3101149627;
	HasExternalReference!: (Reference<IfcExternalReferenceRelationship> | IfcExternalReferenceRelationship)[] | null;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public StartTime: IfcDateTime , public EndTime: IfcDateTime , public TimeSeriesDataType: IfcTimeSeriesDataTypeEnum , public DataOrigin: IfcDataOriginEnum , public UserDefinedDataOrigin: IfcLabel | null, public Unit: IfcUnit | null)
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
export class IfcWorkTime extends IfcSchedulingTime {
	expressID:number=1236880293;
	constructor(expressID: number, public Name: IfcLabel | null, public DataOrigin: IfcDataOriginEnum | null, public UserDefinedDataOrigin: IfcLabel | null, public RecurrencePattern: (Reference<IfcRecurrencePattern> | IfcRecurrencePattern) | null, public Start: IfcDate | null, public Finish: IfcDate | null)
	{
		super(expressID,Name, DataOrigin, UserDefinedDataOrigin);
	}
}
export class IfcApprovalRelationship extends IfcResourceLevelRelationship {
	expressID:number=3869604511;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingApproval: (Reference<IfcApproval> | IfcApproval) , public RelatedApprovals: (Reference<IfcApproval> | IfcApproval)[] )
	{
		super(expressID,Name, Description);
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
	constructor(expressID: number, public RepeatS: IfcBoolean , public RepeatT: IfcBoolean , public Mode: IfcIdentifier | null, public TextureTransform: (Reference<IfcCartesianTransformationOperator2D> | IfcCartesianTransformationOperator2D) | null, public Parameter: IfcIdentifier[] | null, public RasterFormat: IfcIdentifier , public RasterCode: IfcBinary )
	{
		super(expressID,RepeatS, RepeatT, Mode, TextureTransform, Parameter);
	}
}
export class IfcCenterLineProfileDef extends IfcArbitraryOpenProfileDef {
	expressID:number=3150382593;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Curve: (Reference<IfcBoundedCurve> | IfcBoundedCurve) , public Thickness: IfcPositiveLengthMeasure )
	{
		super(expressID,ProfileType, ProfileName, Curve);
	}
}
export class IfcClassification extends IfcExternalInformation {
	expressID:number=747523909;
	ClassificationForObjects!: (Reference<IfcRelAssociatesClassification> | IfcRelAssociatesClassification)[] | null;
	HasReferences!: (Reference<IfcClassificationReference> | IfcClassificationReference)[] | null;
	constructor(expressID: number, public Source: IfcLabel | null, public Edition: IfcLabel | null, public EditionDate: IfcDate | null, public Name: IfcLabel , public Description: IfcText | null, public Location: IfcURIReference | null, public ReferenceTokens: IfcIdentifier[] | null)
	{
			super(expressID);
	}
}
export class IfcClassificationReference extends IfcExternalReference {
	expressID:number=647927063;
	ClassificationRefForObjects!: (Reference<IfcRelAssociatesClassification> | IfcRelAssociatesClassification)[] | null;
	HasReferences!: (Reference<IfcClassificationReference> | IfcClassificationReference)[] | null;
	constructor(expressID: number, public Location: IfcURIReference | null, public Identification: IfcIdentifier | null, public Name: IfcLabel | null, public ReferencedSource: IfcClassificationReferenceSelect | null, public Description: IfcText | null, public Sort: IfcIdentifier | null)
	{
		super(expressID,Location, Identification, Name);
	}
}
export class IfcColourRgbList extends IfcPresentationItem {
	expressID:number=3285139300;
	constructor(expressID: number, public ColourList: IfcNormalisedRatioMeasure[] )
	{
			super(expressID);
	}
}
export class IfcColourSpecification extends IfcPresentationItem {
	expressID:number=3264961684;
	constructor(expressID: number, public Name: IfcLabel | null)
	{
			super(expressID);
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
	HasExternalReference!: (Reference<IfcExternalReferenceRelationship> | IfcExternalReferenceRelationship)[] | null;
	constructor(expressID: number, public Dimensions: (Reference<IfcDimensionalExponents> | IfcDimensionalExponents) , public UnitType: IfcUnitEnum , public Name: IfcLabel )
	{
		super(expressID,Dimensions, UnitType);
	}
}
export class IfcConversionBasedUnit extends IfcNamedUnit {
	expressID:number=2889183280;
	HasExternalReference!: (Reference<IfcExternalReferenceRelationship> | IfcExternalReferenceRelationship)[] | null;
	constructor(expressID: number, public Dimensions: (Reference<IfcDimensionalExponents> | IfcDimensionalExponents) , public UnitType: IfcUnitEnum , public Name: IfcLabel , public ConversionFactor: (Reference<IfcMeasureWithUnit> | IfcMeasureWithUnit) )
	{
		super(expressID,Dimensions, UnitType);
	}
}
export class IfcConversionBasedUnitWithOffset extends IfcConversionBasedUnit {
	expressID:number=2713554722;
	constructor(expressID: number, public Dimensions: (Reference<IfcDimensionalExponents> | IfcDimensionalExponents) , public UnitType: IfcUnitEnum , public Name: IfcLabel , public ConversionFactor: (Reference<IfcMeasureWithUnit> | IfcMeasureWithUnit) , public ConversionOffset: IfcReal )
	{
		super(expressID,Dimensions, UnitType, Name, ConversionFactor);
	}
}
export class IfcCurrencyRelationship extends IfcResourceLevelRelationship {
	expressID:number=539742890;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingMonetaryUnit: (Reference<IfcMonetaryUnit> | IfcMonetaryUnit) , public RelatedMonetaryUnit: (Reference<IfcMonetaryUnit> | IfcMonetaryUnit) , public ExchangeRate: IfcPositiveRatioMeasure , public RateDateTime: IfcDateTime | null, public RateSource: (Reference<IfcLibraryInformation> | IfcLibraryInformation) | null)
	{
		super(expressID,Name, Description);
	}
}
export class IfcCurveStyle extends IfcPresentationStyle {
	expressID:number=3800577675;
	constructor(expressID: number, public Name: IfcLabel | null, public CurveFont: IfcCurveFontOrScaledCurveFontSelect | null, public CurveWidth: IfcSizeSelect | null, public CurveColour: IfcColour | null, public ModelOrDraughting: IfcBoolean | null)
	{
		super(expressID,Name);
	}
}
export class IfcCurveStyleFont extends IfcPresentationItem {
	expressID:number=1105321065;
	constructor(expressID: number, public Name: IfcLabel | null, public PatternList: (Reference<IfcCurveStyleFontPattern> | IfcCurveStyleFontPattern)[] )
	{
			super(expressID);
	}
}
export class IfcCurveStyleFontAndScaling extends IfcPresentationItem {
	expressID:number=2367409068;
	constructor(expressID: number, public Name: IfcLabel | null, public CurveFont: IfcCurveStyleFontSelect , public CurveFontScaling: IfcPositiveRatioMeasure )
	{
			super(expressID);
	}
}
export class IfcCurveStyleFontPattern extends IfcPresentationItem {
	expressID:number=3510044353;
	constructor(expressID: number, public VisibleSegmentLength: IfcLengthMeasure , public InvisibleSegmentLength: IfcPositiveLengthMeasure )
	{
			super(expressID);
	}
}
export class IfcDerivedProfileDef extends IfcProfileDef {
	expressID:number=3632507154;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public ParentProfile: (Reference<IfcProfileDef> | IfcProfileDef) , public Operator: (Reference<IfcCartesianTransformationOperator2D> | IfcCartesianTransformationOperator2D) , public Label: IfcLabel | null)
	{
		super(expressID,ProfileType, ProfileName);
	}
}
export class IfcDocumentInformation extends IfcExternalInformation {
	expressID:number=1154170062;
	DocumentInfoForObjects!: (Reference<IfcRelAssociatesDocument> | IfcRelAssociatesDocument)[] | null;
	HasDocumentReferences!: (Reference<IfcDocumentReference> | IfcDocumentReference)[] | null;
	IsPointedTo!: (Reference<IfcDocumentInformationRelationship> | IfcDocumentInformationRelationship)[] | null;
	IsPointer!: (Reference<IfcDocumentInformationRelationship> | IfcDocumentInformationRelationship)[] | null;
	constructor(expressID: number, public Identification: IfcIdentifier , public Name: IfcLabel , public Description: IfcText | null, public Location: IfcURIReference | null, public Purpose: IfcText | null, public IntendedUse: IfcText | null, public Scope: IfcText | null, public Revision: IfcLabel | null, public DocumentOwner: IfcActorSelect | null, public Editors: IfcActorSelect[] | null, public CreationTime: IfcDateTime | null, public LastRevisionTime: IfcDateTime | null, public ElectronicFormat: IfcIdentifier | null, public ValidFrom: IfcDate | null, public ValidUntil: IfcDate | null, public Confidentiality: IfcDocumentConfidentialityEnum | null, public Status: IfcDocumentStatusEnum | null)
	{
			super(expressID);
	}
}
export class IfcDocumentInformationRelationship extends IfcResourceLevelRelationship {
	expressID:number=770865208;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingDocument: (Reference<IfcDocumentInformation> | IfcDocumentInformation) , public RelatedDocuments: (Reference<IfcDocumentInformation> | IfcDocumentInformation)[] , public RelationshipType: IfcLabel | null)
	{
		super(expressID,Name, Description);
	}
}
export class IfcDocumentReference extends IfcExternalReference {
	expressID:number=3732053477;
	DocumentRefForObjects!: (Reference<IfcRelAssociatesDocument> | IfcRelAssociatesDocument)[] | null;
	constructor(expressID: number, public Location: IfcURIReference | null, public Identification: IfcIdentifier | null, public Name: IfcLabel | null, public Description: IfcText | null, public ReferencedDocument: (Reference<IfcDocumentInformation> | IfcDocumentInformation) | null)
	{
		super(expressID,Location, Identification, Name);
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
	constructor(expressID: number, public EdgeStart: (Reference<IfcVertex> | IfcVertex) , public EdgeEnd: (Reference<IfcVertex> | IfcVertex) , public EdgeGeometry: (Reference<IfcCurve> | IfcCurve) , public SameSense: IfcBoolean )
	{
		super(expressID,EdgeStart, EdgeEnd);
	}
}
export class IfcEventTime extends IfcSchedulingTime {
	expressID:number=211053100;
	constructor(expressID: number, public Name: IfcLabel | null, public DataOrigin: IfcDataOriginEnum | null, public UserDefinedDataOrigin: IfcLabel | null, public ActualDate: IfcDateTime | null, public EarlyDate: IfcDateTime | null, public LateDate: IfcDateTime | null, public ScheduleDate: IfcDateTime | null)
	{
		super(expressID,Name, DataOrigin, UserDefinedDataOrigin);
	}
}
export class IfcExtendedProperties extends IfcPropertyAbstraction {
	expressID:number=297599258;
	constructor(expressID: number, public Name: IfcIdentifier | null, public Description: IfcText | null, public Properties: (Reference<IfcProperty> | IfcProperty)[] )
	{
			super(expressID);
	}
}
export class IfcExternalReferenceRelationship extends IfcResourceLevelRelationship {
	expressID:number=1437805879;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingReference: (Reference<IfcExternalReference> | IfcExternalReference) , public RelatedResourceObjects: IfcResourceObjectSelect[] )
	{
		super(expressID,Name, Description);
	}
}
export class IfcFace extends IfcTopologicalRepresentationItem {
	expressID:number=2556980723;
	HasTextureMaps!: (Reference<IfcTextureMap> | IfcTextureMap)[] | null;
	constructor(expressID: number, public Bounds: (Reference<IfcFaceBound> | IfcFaceBound)[] )
	{
			super(expressID);
	}
}
export class IfcFaceBound extends IfcTopologicalRepresentationItem {
	expressID:number=1809719519;
	constructor(expressID: number, public Bound: (Reference<IfcLoop> | IfcLoop) , public Orientation: IfcBoolean )
	{
			super(expressID);
	}
}
export class IfcFaceOuterBound extends IfcFaceBound {
	expressID:number=803316827;
	constructor(expressID: number, public Bound: (Reference<IfcLoop> | IfcLoop) , public Orientation: IfcBoolean )
	{
		super(expressID,Bound, Orientation);
	}
}
export class IfcFaceSurface extends IfcFace {
	expressID:number=3008276851;
	constructor(expressID: number, public Bounds: (Reference<IfcFaceBound> | IfcFaceBound)[] , public FaceSurface: (Reference<IfcSurface> | IfcSurface) , public SameSense: IfcBoolean )
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
	constructor(expressID: number, public Name: IfcLabel | null, public FillStyles: IfcFillStyleSelect[] , public ModelorDraughting: IfcBoolean | null)
	{
		super(expressID,Name);
	}
}
export class IfcGeometricRepresentationContext extends IfcRepresentationContext {
	expressID:number=3448662350;
	HasSubContexts!: (Reference<IfcGeometricRepresentationSubContext> | IfcGeometricRepresentationSubContext)[] | null;
	HasCoordinateOperation!: (Reference<IfcCoordinateOperation> | IfcCoordinateOperation)[] | null;
	constructor(expressID: number, public ContextIdentifier: IfcLabel | null, public ContextType: IfcLabel | null, public CoordinateSpaceDimension: IfcDimensionCount , public Precision: IfcReal | null, public WorldCoordinateSystem: IfcAxis2Placement , public TrueNorth: (Reference<IfcDirection> | IfcDirection) | null)
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
	constructor(expressID: number, public PlacementLocation: (Reference<IfcVirtualGridIntersection> | IfcVirtualGridIntersection) , public PlacementRefDirection: IfcGridPlacementDirectionSelect | null)
	{
			super(expressID);
	}
}
export class IfcHalfSpaceSolid extends IfcGeometricRepresentationItem {
	expressID:number=812098782;
	constructor(expressID: number, public BaseSurface: (Reference<IfcSurface> | IfcSurface) , public AgreementFlag: IfcBoolean )
	{
			super(expressID);
	}
}
export class IfcImageTexture extends IfcSurfaceTexture {
	expressID:number=3905492369;
	constructor(expressID: number, public RepeatS: IfcBoolean , public RepeatT: IfcBoolean , public Mode: IfcIdentifier | null, public TextureTransform: (Reference<IfcCartesianTransformationOperator2D> | IfcCartesianTransformationOperator2D) | null, public Parameter: IfcIdentifier[] | null, public URLReference: IfcURIReference )
	{
		super(expressID,RepeatS, RepeatT, Mode, TextureTransform, Parameter);
	}
}
export class IfcIndexedColourMap extends IfcPresentationItem {
	expressID:number=3570813810;
	constructor(expressID: number, public MappedTo: (Reference<IfcTessellatedFaceSet> | IfcTessellatedFaceSet) , public Opacity: IfcNormalisedRatioMeasure | null, public Colours: (Reference<IfcColourRgbList> | IfcColourRgbList) , public ColourIndex: IfcPositiveInteger[] )
	{
			super(expressID);
	}
}
export class IfcIndexedTextureMap extends IfcTextureCoordinate {
	expressID:number=1437953363;
	constructor(expressID: number, public Maps: (Reference<IfcSurfaceTexture> | IfcSurfaceTexture)[] , public MappedTo: (Reference<IfcTessellatedFaceSet> | IfcTessellatedFaceSet) , public TexCoords: (Reference<IfcTextureVertexList> | IfcTextureVertexList) )
	{
		super(expressID,Maps);
	}
}
export class IfcIndexedTriangleTextureMap extends IfcIndexedTextureMap {
	expressID:number=2133299955;
	constructor(expressID: number, public Maps: (Reference<IfcSurfaceTexture> | IfcSurfaceTexture)[] , public MappedTo: (Reference<IfcTessellatedFaceSet> | IfcTessellatedFaceSet) , public TexCoords: (Reference<IfcTextureVertexList> | IfcTextureVertexList) , public TexCoordIndex: IfcPositiveInteger[] | null)
	{
		super(expressID,Maps, MappedTo, TexCoords);
	}
}
export class IfcIrregularTimeSeries extends IfcTimeSeries {
	expressID:number=3741457305;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public StartTime: IfcDateTime , public EndTime: IfcDateTime , public TimeSeriesDataType: IfcTimeSeriesDataTypeEnum , public DataOrigin: IfcDataOriginEnum , public UserDefinedDataOrigin: IfcLabel | null, public Unit: IfcUnit | null, public Values: (Reference<IfcIrregularTimeSeriesValue> | IfcIrregularTimeSeriesValue)[] )
	{
		super(expressID,Name, Description, StartTime, EndTime, TimeSeriesDataType, DataOrigin, UserDefinedDataOrigin, Unit);
	}
}
export class IfcLagTime extends IfcSchedulingTime {
	expressID:number=1585845231;
	constructor(expressID: number, public Name: IfcLabel | null, public DataOrigin: IfcDataOriginEnum | null, public UserDefinedDataOrigin: IfcLabel | null, public LagValue: IfcTimeOrRatioSelect , public DurationType: IfcTaskDurationEnum )
	{
		super(expressID,Name, DataOrigin, UserDefinedDataOrigin);
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
export class IfcMaterial extends IfcMaterialDefinition {
	expressID:number=1838606355;
	HasRepresentation!: (Reference<IfcMaterialDefinitionRepresentation> | IfcMaterialDefinitionRepresentation)[] | null;
	IsRelatedWith!: (Reference<IfcMaterialRelationship> | IfcMaterialRelationship)[] | null;
	RelatesTo!: (Reference<IfcMaterialRelationship> | IfcMaterialRelationship)[] | null;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public Category: IfcLabel | null)
	{
			super(expressID);
	}
}
export class IfcMaterialConstituent extends IfcMaterialDefinition {
	expressID:number=3708119000;
	ToMaterialConstituentSet!: (Reference<IfcMaterialConstituentSet> | IfcMaterialConstituentSet) | null;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public Material: (Reference<IfcMaterial> | IfcMaterial) , public Fraction: IfcNormalisedRatioMeasure | null, public Category: IfcLabel | null)
	{
			super(expressID);
	}
}
export class IfcMaterialConstituentSet extends IfcMaterialDefinition {
	expressID:number=2852063980;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public MaterialConstituents: (Reference<IfcMaterialConstituent> | IfcMaterialConstituent)[] | null)
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
export class IfcMaterialLayerSetUsage extends IfcMaterialUsageDefinition {
	expressID:number=1303795690;
	constructor(expressID: number, public ForLayerSet: (Reference<IfcMaterialLayerSet> | IfcMaterialLayerSet) , public LayerSetDirection: IfcLayerSetDirectionEnum , public DirectionSense: IfcDirectionSenseEnum , public OffsetFromReferenceLine: IfcLengthMeasure , public ReferenceExtent: IfcPositiveLengthMeasure | null)
	{
			super(expressID);
	}
}
export class IfcMaterialProfileSetUsage extends IfcMaterialUsageDefinition {
	expressID:number=3079605661;
	constructor(expressID: number, public ForProfileSet: (Reference<IfcMaterialProfileSet> | IfcMaterialProfileSet) , public CardinalPoint: IfcCardinalPointReference | null, public ReferenceExtent: IfcPositiveLengthMeasure | null)
	{
			super(expressID);
	}
}
export class IfcMaterialProfileSetUsageTapering extends IfcMaterialProfileSetUsage {
	expressID:number=3404854881;
	constructor(expressID: number, public ForProfileSet: (Reference<IfcMaterialProfileSet> | IfcMaterialProfileSet) , public CardinalPoint: IfcCardinalPointReference | null, public ReferenceExtent: IfcPositiveLengthMeasure | null, public ForProfileEndSet: (Reference<IfcMaterialProfileSet> | IfcMaterialProfileSet) , public CardinalEndPoint: IfcCardinalPointReference | null)
	{
		super(expressID,ForProfileSet, CardinalPoint, ReferenceExtent);
	}
}
export class IfcMaterialProperties extends IfcExtendedProperties {
	expressID:number=3265635763;
	constructor(expressID: number, public Name: IfcIdentifier | null, public Description: IfcText | null, public Properties: (Reference<IfcProperty> | IfcProperty)[] , public Material: (Reference<IfcMaterialDefinition> | IfcMaterialDefinition) )
	{
		super(expressID,Name, Description, Properties);
	}
}
export class IfcMaterialRelationship extends IfcResourceLevelRelationship {
	expressID:number=853536259;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingMaterial: (Reference<IfcMaterial> | IfcMaterial) , public RelatedMaterials: (Reference<IfcMaterial> | IfcMaterial)[] , public Expression: IfcLabel | null)
	{
		super(expressID,Name, Description);
	}
}
export class IfcMirroredProfileDef extends IfcDerivedProfileDef {
	expressID:number=2998442950;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public ParentProfile: (Reference<IfcProfileDef> | IfcProfileDef) , public Label: IfcLabel | null)
	{
		super(expressID,ProfileType, ProfileName, ParentProfile, new Reference(0), Label);
	}
}
export class IfcObjectDefinition extends IfcRoot {
	expressID:number=219451334;
	HasAssignments!: (Reference<IfcRelAssigns> | IfcRelAssigns)[] | null;
	Nests!: (Reference<IfcRelNests> | IfcRelNests)[] | null;
	IsNestedBy!: (Reference<IfcRelNests> | IfcRelNests)[] | null;
	HasContext!: (Reference<IfcRelDeclares> | IfcRelDeclares)[] | null;
	IsDecomposedBy!: (Reference<IfcRelAggregates> | IfcRelAggregates)[] | null;
	Decomposes!: (Reference<IfcRelAggregates> | IfcRelAggregates)[] | null;
	HasAssociations!: (Reference<IfcRelAssociates> | IfcRelAssociates)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcOpenShell extends IfcConnectedFaceSet {
	expressID:number=2665983363;
	constructor(expressID: number, public CfsFaces: (Reference<IfcFace> | IfcFace)[] )
	{
		super(expressID,CfsFaces);
	}
}
export class IfcOrganizationRelationship extends IfcResourceLevelRelationship {
	expressID:number=1411181986;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingOrganization: (Reference<IfcOrganization> | IfcOrganization) , public RelatedOrganizations: (Reference<IfcOrganization> | IfcOrganization)[] )
	{
		super(expressID,Name, Description);
	}
}
export class IfcOrientedEdge extends IfcEdge {
	expressID:number=1029017970;
	constructor(expressID: number, public EdgeElement: (Reference<IfcEdge> | IfcEdge) , public Orientation: IfcBoolean )
	{
		super(expressID,new Reference(0), new Reference(0));
	}
}
export class IfcParameterizedProfileDef extends IfcProfileDef {
	expressID:number=2529465313;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) | null)
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
	constructor(expressID: number, public RepeatS: IfcBoolean , public RepeatT: IfcBoolean , public Mode: IfcIdentifier | null, public TextureTransform: (Reference<IfcCartesianTransformationOperator2D> | IfcCartesianTransformationOperator2D) | null, public Parameter: IfcIdentifier[] | null, public Width: IfcInteger , public Height: IfcInteger , public ColourComponents: IfcInteger , public Pixel: IfcBinary[] )
	{
		super(expressID,RepeatS, RepeatT, Mode, TextureTransform, Parameter);
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
	constructor(expressID: number, public BaseSurface: (Reference<IfcSurface> | IfcSurface) , public AgreementFlag: IfcBoolean , public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) , public PolygonalBoundary: (Reference<IfcBoundedCurve> | IfcBoundedCurve) )
	{
		super(expressID,BaseSurface, AgreementFlag);
	}
}
export class IfcPreDefinedItem extends IfcPresentationItem {
	expressID:number=3727388367;
	constructor(expressID: number, public Name: IfcLabel )
	{
			super(expressID);
	}
}
export class IfcPreDefinedProperties extends IfcPropertyAbstraction {
	expressID:number=3778827333;
	constructor(expressID: number, )
	{
			super(expressID);
	}
}
export class IfcPreDefinedTextFont extends IfcPreDefinedItem {
	expressID:number=1775413392;
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
export class IfcProfileProperties extends IfcExtendedProperties {
	expressID:number=2802850158;
	constructor(expressID: number, public Name: IfcIdentifier | null, public Description: IfcText | null, public Properties: (Reference<IfcProperty> | IfcProperty)[] , public ProfileDefinition: (Reference<IfcProfileDef> | IfcProfileDef) )
	{
		super(expressID,Name, Description, Properties);
	}
}
export class IfcProperty extends IfcPropertyAbstraction {
	expressID:number=2598011224;
	PartOfPset!: (Reference<IfcPropertySet> | IfcPropertySet)[] | null;
	PropertyForDependance!: (Reference<IfcPropertyDependencyRelationship> | IfcPropertyDependencyRelationship)[] | null;
	PropertyDependsOn!: (Reference<IfcPropertyDependencyRelationship> | IfcPropertyDependencyRelationship)[] | null;
	PartOfComplex!: (Reference<IfcComplexProperty> | IfcComplexProperty)[] | null;
	HasConstraints!: (Reference<IfcResourceConstraintRelationship> | IfcResourceConstraintRelationship)[] | null;
	HasApprovals!: (Reference<IfcResourceApprovalRelationship> | IfcResourceApprovalRelationship)[] | null;
	constructor(expressID: number, public Name: IfcIdentifier , public Description: IfcText | null)
	{
			super(expressID);
	}
}
export class IfcPropertyDefinition extends IfcRoot {
	expressID:number=1680319473;
	HasContext!: (Reference<IfcRelDeclares> | IfcRelDeclares)[] | null;
	HasAssociations!: (Reference<IfcRelAssociates> | IfcRelAssociates)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcPropertyDependencyRelationship extends IfcResourceLevelRelationship {
	expressID:number=148025276;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public DependingProperty: (Reference<IfcProperty> | IfcProperty) , public DependantProperty: (Reference<IfcProperty> | IfcProperty) , public Expression: IfcText | null)
	{
		super(expressID,Name, Description);
	}
}
export class IfcPropertySetDefinition extends IfcPropertyDefinition {
	expressID:number=3357820518;
	DefinesType!: (Reference<IfcTypeObject> | IfcTypeObject)[] | null;
	IsDefinedBy!: (Reference<IfcRelDefinesByTemplate> | IfcRelDefinesByTemplate)[] | null;
	DefinesOccurrence!: (Reference<IfcRelDefinesByProperties> | IfcRelDefinesByProperties)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcPropertyTemplateDefinition extends IfcPropertyDefinition {
	expressID:number=1482703590;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcQuantitySet extends IfcPropertySetDefinition {
	expressID:number=2090586900;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRectangleProfileDef extends IfcParameterizedProfileDef {
	expressID:number=3615266464;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) | null, public XDim: IfcPositiveLengthMeasure , public YDim: IfcPositiveLengthMeasure )
	{
		super(expressID,ProfileType, ProfileName, Position);
	}
}
export class IfcRegularTimeSeries extends IfcTimeSeries {
	expressID:number=3413951693;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public StartTime: IfcDateTime , public EndTime: IfcDateTime , public TimeSeriesDataType: IfcTimeSeriesDataTypeEnum , public DataOrigin: IfcDataOriginEnum , public UserDefinedDataOrigin: IfcLabel | null, public Unit: IfcUnit | null, public TimeStep: IfcTimeMeasure , public Values: (Reference<IfcTimeSeriesValue> | IfcTimeSeriesValue)[] )
	{
		super(expressID,Name, Description, StartTime, EndTime, TimeSeriesDataType, DataOrigin, UserDefinedDataOrigin, Unit);
	}
}
export class IfcReinforcementBarProperties extends IfcPreDefinedProperties {
	expressID:number=1580146022;
	constructor(expressID: number, public TotalCrossSectionArea: IfcAreaMeasure , public SteelGrade: IfcLabel , public BarSurface: IfcReinforcingBarSurfaceEnum | null, public EffectiveDepth: IfcLengthMeasure | null, public NominalBarDiameter: IfcPositiveLengthMeasure | null, public BarCount: IfcCountMeasure | null)
	{
			super(expressID);
	}
}
export class IfcRelationship extends IfcRoot {
	expressID:number=478536968;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcResourceApprovalRelationship extends IfcResourceLevelRelationship {
	expressID:number=2943643501;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public RelatedResourceObjects: IfcResourceObjectSelect[] , public RelatingApproval: (Reference<IfcApproval> | IfcApproval) )
	{
		super(expressID,Name, Description);
	}
}
export class IfcResourceConstraintRelationship extends IfcResourceLevelRelationship {
	expressID:number=1608871552;
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingConstraint: (Reference<IfcConstraint> | IfcConstraint) , public RelatedResourceObjects: IfcResourceObjectSelect[] )
	{
		super(expressID,Name, Description);
	}
}
export class IfcResourceTime extends IfcSchedulingTime {
	expressID:number=1042787934;
	constructor(expressID: number, public Name: IfcLabel | null, public DataOrigin: IfcDataOriginEnum | null, public UserDefinedDataOrigin: IfcLabel | null, public ScheduleWork: IfcDuration | null, public ScheduleUsage: IfcPositiveRatioMeasure | null, public ScheduleStart: IfcDateTime | null, public ScheduleFinish: IfcDateTime | null, public ScheduleContour: IfcLabel | null, public LevelingDelay: IfcDuration | null, public IsOverAllocated: IfcBoolean | null, public StatusTime: IfcDateTime | null, public ActualWork: IfcDuration | null, public ActualUsage: IfcPositiveRatioMeasure | null, public ActualStart: IfcDateTime | null, public ActualFinish: IfcDateTime | null, public RemainingWork: IfcDuration | null, public RemainingUsage: IfcPositiveRatioMeasure | null, public Completion: IfcPositiveRatioMeasure | null)
	{
		super(expressID,Name, DataOrigin, UserDefinedDataOrigin);
	}
}
export class IfcRoundedRectangleProfileDef extends IfcRectangleProfileDef {
	expressID:number=2778083089;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) | null, public XDim: IfcPositiveLengthMeasure , public YDim: IfcPositiveLengthMeasure , public RoundingRadius: IfcPositiveLengthMeasure )
	{
		super(expressID,ProfileType, ProfileName, Position, XDim, YDim);
	}
}
export class IfcSectionProperties extends IfcPreDefinedProperties {
	expressID:number=2042790032;
	constructor(expressID: number, public SectionType: IfcSectionTypeEnum , public StartProfile: (Reference<IfcProfileDef> | IfcProfileDef) , public EndProfile: (Reference<IfcProfileDef> | IfcProfileDef) | null)
	{
			super(expressID);
	}
}
export class IfcSectionReinforcementProperties extends IfcPreDefinedProperties {
	expressID:number=4165799628;
	constructor(expressID: number, public LongitudinalStartPosition: IfcLengthMeasure , public LongitudinalEndPosition: IfcLengthMeasure , public TransversePosition: IfcLengthMeasure | null, public ReinforcementRole: IfcReinforcingBarRoleEnum , public SectionDefinition: (Reference<IfcSectionProperties> | IfcSectionProperties) , public CrossSectionReinforcementDefinitions: (Reference<IfcReinforcementBarProperties> | IfcReinforcementBarProperties)[] )
	{
			super(expressID);
	}
}
export class IfcSectionedSpine extends IfcGeometricRepresentationItem {
	expressID:number=1509187699;
	constructor(expressID: number, public SpineCurve: (Reference<IfcCompositeCurve> | IfcCompositeCurve) , public CrossSections: (Reference<IfcProfileDef> | IfcProfileDef)[] , public CrossSectionPositions: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D)[] )
	{
			super(expressID);
	}
}
export class IfcShellBasedSurfaceModel extends IfcGeometricRepresentationItem {
	expressID:number=4124623270;
	constructor(expressID: number, public SbsmBoundary: IfcShell[] )
	{
			super(expressID);
	}
}
export class IfcSimpleProperty extends IfcProperty {
	expressID:number=3692461612;
	constructor(expressID: number, public Name: IfcIdentifier , public Description: IfcText | null)
	{
		super(expressID,Name, Description);
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
		super(expressID,SurfaceColour, Transparency);
	}
}
export class IfcSweptAreaSolid extends IfcSolidModel {
	expressID:number=2247615214;
	constructor(expressID: number, public SweptArea: (Reference<IfcProfileDef> | IfcProfileDef) , public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) | null)
	{
			super(expressID);
	}
}
export class IfcSweptDiskSolid extends IfcSolidModel {
	expressID:number=1260650574;
	constructor(expressID: number, public Directrix: (Reference<IfcCurve> | IfcCurve) , public Radius: IfcPositiveLengthMeasure , public InnerRadius: IfcPositiveLengthMeasure | null, public StartParam: IfcParameterValue | null, public EndParam: IfcParameterValue | null)
	{
			super(expressID);
	}
}
export class IfcSweptDiskSolidPolygonal extends IfcSweptDiskSolid {
	expressID:number=1096409881;
	constructor(expressID: number, public Directrix: (Reference<IfcCurve> | IfcCurve) , public Radius: IfcPositiveLengthMeasure , public InnerRadius: IfcPositiveLengthMeasure | null, public StartParam: IfcParameterValue | null, public EndParam: IfcParameterValue | null, public FilletRadius: IfcPositiveLengthMeasure | null)
	{
		super(expressID,Directrix, Radius, InnerRadius, StartParam, EndParam);
	}
}
export class IfcSweptSurface extends IfcSurface {
	expressID:number=230924584;
	constructor(expressID: number, public SweptCurve: (Reference<IfcProfileDef> | IfcProfileDef) , public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) | null)
	{
			super(expressID);
	}
}
export class IfcTShapeProfileDef extends IfcParameterizedProfileDef {
	expressID:number=3071757647;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) | null, public Depth: IfcPositiveLengthMeasure , public FlangeWidth: IfcPositiveLengthMeasure , public WebThickness: IfcPositiveLengthMeasure , public FlangeThickness: IfcPositiveLengthMeasure , public FilletRadius: IfcNonNegativeLengthMeasure | null, public FlangeEdgeRadius: IfcNonNegativeLengthMeasure | null, public WebEdgeRadius: IfcNonNegativeLengthMeasure | null, public WebSlope: IfcPlaneAngleMeasure | null, public FlangeSlope: IfcPlaneAngleMeasure | null)
	{
		super(expressID,ProfileType, ProfileName, Position);
	}
}
export class IfcTessellatedItem extends IfcGeometricRepresentationItem {
	expressID:number=901063453;
	constructor(expressID: number, )
	{
			super(expressID);
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
export class IfcTextStyleFontModel extends IfcPreDefinedTextFont {
	expressID:number=1983826977;
	constructor(expressID: number, public Name: IfcLabel , public FontFamily: IfcTextFontName[] , public FontStyle: IfcFontStyle | null, public FontVariant: IfcFontVariant | null, public FontWeight: IfcFontWeight | null, public FontSize: IfcSizeSelect )
	{
		super(expressID,Name);
	}
}
export class IfcTrapeziumProfileDef extends IfcParameterizedProfileDef {
	expressID:number=2715220739;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) | null, public BottomXDim: IfcPositiveLengthMeasure , public TopXDim: IfcPositiveLengthMeasure , public YDim: IfcPositiveLengthMeasure , public TopXOffset: IfcLengthMeasure )
	{
		super(expressID,ProfileType, ProfileName, Position);
	}
}
export class IfcTypeObject extends IfcObjectDefinition {
	expressID:number=1628702193;
	Types!: (Reference<IfcRelDefinesByType> | IfcRelDefinesByType)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcTypeProcess extends IfcTypeObject {
	expressID:number=3736923433;
	OperatesOn!: (Reference<IfcRelAssignsToProcess> | IfcRelAssignsToProcess)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public Identification: IfcIdentifier | null, public LongDescription: IfcText | null, public ProcessType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets);
	}
}
export class IfcTypeProduct extends IfcTypeObject {
	expressID:number=2347495698;
	ReferencedBy!: (Reference<IfcRelAssignsToProduct> | IfcRelAssignsToProduct)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets);
	}
}
export class IfcTypeResource extends IfcTypeObject {
	expressID:number=3698973494;
	ResourceOf!: (Reference<IfcRelAssignsToResource> | IfcRelAssignsToResource)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public Identification: IfcIdentifier | null, public LongDescription: IfcText | null, public ResourceType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets);
	}
}
export class IfcUShapeProfileDef extends IfcParameterizedProfileDef {
	expressID:number=427810014;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) | null, public Depth: IfcPositiveLengthMeasure , public FlangeWidth: IfcPositiveLengthMeasure , public WebThickness: IfcPositiveLengthMeasure , public FlangeThickness: IfcPositiveLengthMeasure , public FilletRadius: IfcNonNegativeLengthMeasure | null, public EdgeRadius: IfcNonNegativeLengthMeasure | null, public FlangeSlope: IfcPlaneAngleMeasure | null)
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
export class IfcWindowStyle extends IfcTypeProduct {
	expressID:number=1299126871;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ConstructionType: IfcWindowStyleConstructionEnum , public OperationType: IfcWindowStyleOperationEnum , public ParameterTakesPrecedence: IfcBoolean , public Sizeable: IfcBoolean )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag);
	}
}
export class IfcZShapeProfileDef extends IfcParameterizedProfileDef {
	expressID:number=2543172580;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) | null, public Depth: IfcPositiveLengthMeasure , public FlangeWidth: IfcPositiveLengthMeasure , public WebThickness: IfcPositiveLengthMeasure , public FlangeThickness: IfcPositiveLengthMeasure , public FilletRadius: IfcNonNegativeLengthMeasure | null, public EdgeRadius: IfcNonNegativeLengthMeasure | null)
	{
		super(expressID,ProfileType, ProfileName, Position);
	}
}
export class IfcAdvancedFace extends IfcFaceSurface {
	expressID:number=3406155212;
	constructor(expressID: number, public Bounds: (Reference<IfcFaceBound> | IfcFaceBound)[] , public FaceSurface: (Reference<IfcSurface> | IfcSurface) , public SameSense: IfcBoolean )
	{
		super(expressID,Bounds, FaceSurface, SameSense);
	}
}
export class IfcAnnotationFillArea extends IfcGeometricRepresentationItem {
	expressID:number=669184980;
	constructor(expressID: number, public OuterBoundary: (Reference<IfcCurve> | IfcCurve) , public InnerBoundaries: (Reference<IfcCurve> | IfcCurve)[] | null)
	{
			super(expressID);
	}
}
export class IfcAsymmetricIShapeProfileDef extends IfcParameterizedProfileDef {
	expressID:number=3207858831;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) | null, public BottomFlangeWidth: IfcPositiveLengthMeasure , public OverallDepth: IfcPositiveLengthMeasure , public WebThickness: IfcPositiveLengthMeasure , public BottomFlangeThickness: IfcPositiveLengthMeasure , public BottomFlangeFilletRadius: IfcNonNegativeLengthMeasure | null, public TopFlangeWidth: IfcPositiveLengthMeasure , public TopFlangeThickness: IfcPositiveLengthMeasure | null, public TopFlangeFilletRadius: IfcNonNegativeLengthMeasure | null, public BottomFlangeEdgeRadius: IfcNonNegativeLengthMeasure | null, public BottomFlangeSlope: IfcPlaneAngleMeasure | null, public TopFlangeEdgeRadius: IfcNonNegativeLengthMeasure | null, public TopFlangeSlope: IfcPlaneAngleMeasure | null)
	{
		super(expressID,ProfileType, ProfileName, Position);
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
	constructor(expressID: number, public BaseSurface: (Reference<IfcSurface> | IfcSurface) , public AgreementFlag: IfcBoolean , public Enclosure: (Reference<IfcBoundingBox> | IfcBoundingBox) )
	{
		super(expressID,BaseSurface, AgreementFlag);
	}
}
export class IfcCShapeProfileDef extends IfcParameterizedProfileDef {
	expressID:number=2898889636;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) | null, public Depth: IfcPositiveLengthMeasure , public Width: IfcPositiveLengthMeasure , public WallThickness: IfcPositiveLengthMeasure , public Girth: IfcPositiveLengthMeasure , public InternalFilletRadius: IfcNonNegativeLengthMeasure | null)
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
export class IfcCartesianPointList extends IfcGeometricRepresentationItem {
	expressID:number=574549367;
	constructor(expressID: number, )
	{
			super(expressID);
	}
}
export class IfcCartesianPointList2D extends IfcCartesianPointList {
	expressID:number=1675464909;
	constructor(expressID: number, public CoordList: IfcLengthMeasure[] )
	{
			super(expressID);
	}
}
export class IfcCartesianPointList3D extends IfcCartesianPointList {
	expressID:number=2059837836;
	constructor(expressID: number, public CoordList: IfcLengthMeasure[] )
	{
			super(expressID);
	}
}
export class IfcCartesianTransformationOperator extends IfcGeometricRepresentationItem {
	expressID:number=59481748;
	constructor(expressID: number, public Axis1: (Reference<IfcDirection> | IfcDirection) | null, public Axis2: (Reference<IfcDirection> | IfcDirection) | null, public LocalOrigin: (Reference<IfcCartesianPoint> | IfcCartesianPoint) , public Scale: IfcReal | null)
	{
			super(expressID);
	}
}
export class IfcCartesianTransformationOperator2D extends IfcCartesianTransformationOperator {
	expressID:number=3749851601;
	constructor(expressID: number, public Axis1: (Reference<IfcDirection> | IfcDirection) | null, public Axis2: (Reference<IfcDirection> | IfcDirection) | null, public LocalOrigin: (Reference<IfcCartesianPoint> | IfcCartesianPoint) , public Scale: IfcReal | null)
	{
		super(expressID,Axis1, Axis2, LocalOrigin, Scale);
	}
}
export class IfcCartesianTransformationOperator2DnonUniform extends IfcCartesianTransformationOperator2D {
	expressID:number=3486308946;
	constructor(expressID: number, public Axis1: (Reference<IfcDirection> | IfcDirection) | null, public Axis2: (Reference<IfcDirection> | IfcDirection) | null, public LocalOrigin: (Reference<IfcCartesianPoint> | IfcCartesianPoint) , public Scale: IfcReal | null, public Scale2: IfcReal | null)
	{
		super(expressID,Axis1, Axis2, LocalOrigin, Scale);
	}
}
export class IfcCartesianTransformationOperator3D extends IfcCartesianTransformationOperator {
	expressID:number=3331915920;
	constructor(expressID: number, public Axis1: (Reference<IfcDirection> | IfcDirection) | null, public Axis2: (Reference<IfcDirection> | IfcDirection) | null, public LocalOrigin: (Reference<IfcCartesianPoint> | IfcCartesianPoint) , public Scale: IfcReal | null, public Axis3: (Reference<IfcDirection> | IfcDirection) | null)
	{
		super(expressID,Axis1, Axis2, LocalOrigin, Scale);
	}
}
export class IfcCartesianTransformationOperator3DnonUniform extends IfcCartesianTransformationOperator3D {
	expressID:number=1416205885;
	constructor(expressID: number, public Axis1: (Reference<IfcDirection> | IfcDirection) | null, public Axis2: (Reference<IfcDirection> | IfcDirection) | null, public LocalOrigin: (Reference<IfcCartesianPoint> | IfcCartesianPoint) , public Scale: IfcReal | null, public Axis3: (Reference<IfcDirection> | IfcDirection) | null, public Scale2: IfcReal | null, public Scale3: IfcReal | null)
	{
		super(expressID,Axis1, Axis2, LocalOrigin, Scale, Axis3);
	}
}
export class IfcCircleProfileDef extends IfcParameterizedProfileDef {
	expressID:number=1383045692;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) | null, public Radius: IfcPositiveLengthMeasure )
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
export class IfcCompositeCurveSegment extends IfcGeometricRepresentationItem {
	expressID:number=2485617015;
	UsingCurves!: (Reference<IfcCompositeCurve> | IfcCompositeCurve)[] | null;
	constructor(expressID: number, public Transition: IfcTransitionCode , public SameSense: IfcBoolean , public ParentCurve: (Reference<IfcCurve> | IfcCurve) )
	{
			super(expressID);
	}
}
export class IfcConstructionResourceType extends IfcTypeResource {
	expressID:number=2574617495;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public Identification: IfcIdentifier | null, public LongDescription: IfcText | null, public ResourceType: IfcLabel | null, public BaseCosts: (Reference<IfcAppliedValue> | IfcAppliedValue)[] | null, public BaseQuantity: (Reference<IfcPhysicalQuantity> | IfcPhysicalQuantity) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, Identification, LongDescription, ResourceType);
	}
}
export class IfcContext extends IfcObjectDefinition {
	expressID:number=3419103109;
	IsDefinedBy!: (Reference<IfcRelDefinesByProperties> | IfcRelDefinesByProperties)[] | null;
	Declares!: (Reference<IfcRelDeclares> | IfcRelDeclares)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public LongName: IfcLabel | null, public Phase: IfcLabel | null, public RepresentationContexts: (Reference<IfcRepresentationContext> | IfcRepresentationContext)[] | null, public UnitsInContext: (Reference<IfcUnitAssignment> | IfcUnitAssignment) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcCrewResourceType extends IfcConstructionResourceType {
	expressID:number=1815067380;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public Identification: IfcIdentifier | null, public LongDescription: IfcText | null, public ResourceType: IfcLabel | null, public BaseCosts: (Reference<IfcAppliedValue> | IfcAppliedValue)[] | null, public BaseQuantity: (Reference<IfcPhysicalQuantity> | IfcPhysicalQuantity) | null, public PredefinedType: IfcCrewResourceTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, Identification, LongDescription, ResourceType, BaseCosts, BaseQuantity);
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
export class IfcCurveBoundedSurface extends IfcBoundedSurface {
	expressID:number=2629017746;
	constructor(expressID: number, public BasisSurface: (Reference<IfcSurface> | IfcSurface) , public Boundaries: (Reference<IfcBoundaryCurve> | IfcBoundaryCurve)[] , public ImplicitOuter: IfcBoolean )
	{
			super(expressID);
	}
}
export class IfcDirection extends IfcGeometricRepresentationItem {
	expressID:number=32440307;
	constructor(expressID: number, public DirectionRatios: IfcReal[] )
	{
			super(expressID);
	}
}
export class IfcDoorStyle extends IfcTypeProduct {
	expressID:number=526551008;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public OperationType: IfcDoorStyleOperationEnum , public ConstructionType: IfcDoorStyleConstructionEnum , public ParameterTakesPrecedence: IfcBoolean , public Sizeable: IfcBoolean )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag);
	}
}
export class IfcEdgeLoop extends IfcLoop {
	expressID:number=1472233963;
	constructor(expressID: number, public EdgeList: (Reference<IfcOrientedEdge> | IfcOrientedEdge)[] )
	{
			super(expressID);
	}
}
export class IfcElementQuantity extends IfcQuantitySet {
	expressID:number=1883228015;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public MethodOfMeasurement: IfcLabel | null, public Quantities: (Reference<IfcPhysicalQuantity> | IfcPhysicalQuantity)[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcElementType extends IfcTypeProduct {
	expressID:number=339256511;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
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
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) | null, public SemiAxis1: IfcPositiveLengthMeasure , public SemiAxis2: IfcPositiveLengthMeasure )
	{
		super(expressID,ProfileType, ProfileName, Position);
	}
}
export class IfcEventType extends IfcTypeProcess {
	expressID:number=4024345920;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public Identification: IfcIdentifier | null, public LongDescription: IfcText | null, public ProcessType: IfcLabel | null, public PredefinedType: IfcEventTypeEnum , public EventTriggerType: IfcEventTriggerTypeEnum , public UserDefinedEventTriggerType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, Identification, LongDescription, ProcessType);
	}
}
export class IfcExtrudedAreaSolid extends IfcSweptAreaSolid {
	expressID:number=477187591;
	constructor(expressID: number, public SweptArea: (Reference<IfcProfileDef> | IfcProfileDef) , public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) | null, public ExtrudedDirection: (Reference<IfcDirection> | IfcDirection) , public Depth: IfcPositiveLengthMeasure )
	{
		super(expressID,SweptArea, Position);
	}
}
export class IfcExtrudedAreaSolidTapered extends IfcExtrudedAreaSolid {
	expressID:number=2804161546;
	constructor(expressID: number, public SweptArea: (Reference<IfcProfileDef> | IfcProfileDef) , public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) | null, public ExtrudedDirection: (Reference<IfcDirection> | IfcDirection) , public Depth: IfcPositiveLengthMeasure , public EndSweptArea: (Reference<IfcProfileDef> | IfcProfileDef) )
	{
		super(expressID,SweptArea, Position, ExtrudedDirection, Depth);
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
export class IfcFillAreaStyleTiles extends IfcGeometricRepresentationItem {
	expressID:number=315944413;
	constructor(expressID: number, public TilingPattern: (Reference<IfcVector> | IfcVector)[] , public Tiles: (Reference<IfcStyledItem> | IfcStyledItem)[] , public TilingScale: IfcPositiveRatioMeasure )
	{
			super(expressID);
	}
}
export class IfcFixedReferenceSweptAreaSolid extends IfcSweptAreaSolid {
	expressID:number=2652556860;
	constructor(expressID: number, public SweptArea: (Reference<IfcProfileDef> | IfcProfileDef) , public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) | null, public Directrix: (Reference<IfcCurve> | IfcCurve) , public StartParam: IfcParameterValue | null, public EndParam: IfcParameterValue | null, public FixedReference: (Reference<IfcDirection> | IfcDirection) )
	{
		super(expressID,SweptArea, Position);
	}
}
export class IfcFurnishingElementType extends IfcElementType {
	expressID:number=4238390223;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFurnitureType extends IfcFurnishingElementType {
	expressID:number=1268542332;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public AssemblyPlace: IfcAssemblyPlaceEnum , public PredefinedType: IfcFurnitureTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcGeographicElementType extends IfcElementType {
	expressID:number=4095422895;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcGeographicElementTypeEnum )
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
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) | null, public OverallWidth: IfcPositiveLengthMeasure , public OverallDepth: IfcPositiveLengthMeasure , public WebThickness: IfcPositiveLengthMeasure , public FlangeThickness: IfcPositiveLengthMeasure , public FilletRadius: IfcNonNegativeLengthMeasure | null, public FlangeEdgeRadius: IfcNonNegativeLengthMeasure | null, public FlangeSlope: IfcPlaneAngleMeasure | null)
	{
		super(expressID,ProfileType, ProfileName, Position);
	}
}
export class IfcIndexedPolygonalFace extends IfcTessellatedItem {
	expressID:number=178912537;
	ToFaceSet!: (Reference<IfcPolygonalFaceSet> | IfcPolygonalFaceSet)[] | null;
	constructor(expressID: number, public CoordIndex: IfcPositiveInteger[] )
	{
			super(expressID);
	}
}
export class IfcIndexedPolygonalFaceWithVoids extends IfcIndexedPolygonalFace {
	expressID:number=2294589976;
	constructor(expressID: number, public CoordIndex: IfcPositiveInteger[] , public InnerCoordIndices: IfcPositiveInteger[] )
	{
		super(expressID,CoordIndex);
	}
}
export class IfcLShapeProfileDef extends IfcParameterizedProfileDef {
	expressID:number=572779678;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) | null, public Depth: IfcPositiveLengthMeasure , public Width: IfcPositiveLengthMeasure | null, public Thickness: IfcPositiveLengthMeasure , public FilletRadius: IfcNonNegativeLengthMeasure | null, public EdgeRadius: IfcNonNegativeLengthMeasure | null, public LegSlope: IfcPlaneAngleMeasure | null)
	{
		super(expressID,ProfileType, ProfileName, Position);
	}
}
export class IfcLaborResourceType extends IfcConstructionResourceType {
	expressID:number=428585644;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public Identification: IfcIdentifier | null, public LongDescription: IfcText | null, public ResourceType: IfcLabel | null, public BaseCosts: (Reference<IfcAppliedValue> | IfcAppliedValue)[] | null, public BaseQuantity: (Reference<IfcPhysicalQuantity> | IfcPhysicalQuantity) | null, public PredefinedType: IfcLaborResourceTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, Identification, LongDescription, ResourceType, BaseCosts, BaseQuantity);
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
	IsDeclaredBy!: (Reference<IfcRelDefinesByObject> | IfcRelDefinesByObject)[] | null;
	Declares!: (Reference<IfcRelDefinesByObject> | IfcRelDefinesByObject)[] | null;
	IsTypedBy!: (Reference<IfcRelDefinesByType> | IfcRelDefinesByType)[] | null;
	IsDefinedBy!: (Reference<IfcRelDefinesByProperties> | IfcRelDefinesByProperties)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcOffsetCurve2D extends IfcCurve {
	expressID:number=3388369263;
	constructor(expressID: number, public BasisCurve: (Reference<IfcCurve> | IfcCurve) , public Distance: IfcLengthMeasure , public SelfIntersect: IfcLogical )
	{
			super(expressID);
	}
}
export class IfcOffsetCurve3D extends IfcCurve {
	expressID:number=3505215534;
	constructor(expressID: number, public BasisCurve: (Reference<IfcCurve> | IfcCurve) , public Distance: IfcLengthMeasure , public SelfIntersect: IfcLogical , public RefDirection: (Reference<IfcDirection> | IfcDirection) )
	{
			super(expressID);
	}
}
export class IfcPcurve extends IfcCurve {
	expressID:number=1682466193;
	constructor(expressID: number, public BasisSurface: (Reference<IfcSurface> | IfcSurface) , public ReferenceCurve: (Reference<IfcCurve> | IfcCurve) )
	{
			super(expressID);
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
export class IfcPreDefinedPropertySet extends IfcPropertySetDefinition {
	expressID:number=3967405729;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcProcedureType extends IfcTypeProcess {
	expressID:number=569719735;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public Identification: IfcIdentifier | null, public LongDescription: IfcText | null, public ProcessType: IfcLabel | null, public PredefinedType: IfcProcedureTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, Identification, LongDescription, ProcessType);
	}
}
export class IfcProcess extends IfcObject {
	expressID:number=2945172077;
	IsPredecessorTo!: (Reference<IfcRelSequence> | IfcRelSequence)[] | null;
	IsSuccessorFrom!: (Reference<IfcRelSequence> | IfcRelSequence)[] | null;
	OperatesOn!: (Reference<IfcRelAssignsToProcess> | IfcRelAssignsToProcess)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identification: IfcIdentifier | null, public LongDescription: IfcText | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcProduct extends IfcObject {
	expressID:number=4208778838;
	ReferencedBy!: (Reference<IfcRelAssignsToProduct> | IfcRelAssignsToProduct)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcProject extends IfcContext {
	expressID:number=103090709;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public LongName: IfcLabel | null, public Phase: IfcLabel | null, public RepresentationContexts: (Reference<IfcRepresentationContext> | IfcRepresentationContext)[] | null, public UnitsInContext: (Reference<IfcUnitAssignment> | IfcUnitAssignment) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, LongName, Phase, RepresentationContexts, UnitsInContext);
	}
}
export class IfcProjectLibrary extends IfcContext {
	expressID:number=653396225;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public LongName: IfcLabel | null, public Phase: IfcLabel | null, public RepresentationContexts: (Reference<IfcRepresentationContext> | IfcRepresentationContext)[] | null, public UnitsInContext: (Reference<IfcUnitAssignment> | IfcUnitAssignment) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, LongName, Phase, RepresentationContexts, UnitsInContext);
	}
}
export class IfcPropertyBoundedValue extends IfcSimpleProperty {
	expressID:number=871118103;
	constructor(expressID: number, public Name: IfcIdentifier , public Description: IfcText | null, public UpperBoundValue: IfcValue | null, public LowerBoundValue: IfcValue | null, public Unit: IfcUnit | null, public SetPointValue: IfcValue | null)
	{
		super(expressID,Name, Description);
	}
}
export class IfcPropertyEnumeratedValue extends IfcSimpleProperty {
	expressID:number=4166981789;
	constructor(expressID: number, public Name: IfcIdentifier , public Description: IfcText | null, public EnumerationValues: IfcValue[] | null, public EnumerationReference: (Reference<IfcPropertyEnumeration> | IfcPropertyEnumeration) | null)
	{
		super(expressID,Name, Description);
	}
}
export class IfcPropertyListValue extends IfcSimpleProperty {
	expressID:number=2752243245;
	constructor(expressID: number, public Name: IfcIdentifier , public Description: IfcText | null, public ListValues: IfcValue[] | null, public Unit: IfcUnit | null)
	{
		super(expressID,Name, Description);
	}
}
export class IfcPropertyReferenceValue extends IfcSimpleProperty {
	expressID:number=941946838;
	constructor(expressID: number, public Name: IfcIdentifier , public Description: IfcText | null, public UsageName: IfcText | null, public PropertyReference: IfcObjectReferenceSelect | null)
	{
		super(expressID,Name, Description);
	}
}
export class IfcPropertySet extends IfcPropertySetDefinition {
	expressID:number=1451395588;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public HasProperties: (Reference<IfcProperty> | IfcProperty)[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcPropertySetTemplate extends IfcPropertyTemplateDefinition {
	expressID:number=492091185;
	Defines!: (Reference<IfcRelDefinesByTemplate> | IfcRelDefinesByTemplate)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public TemplateType: IfcPropertySetTemplateTypeEnum | null, public ApplicableEntity: IfcIdentifier | null, public HasPropertyTemplates: (Reference<IfcPropertyTemplate> | IfcPropertyTemplate)[] )
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
	constructor(expressID: number, public Name: IfcIdentifier , public Description: IfcText | null, public DefiningValues: IfcValue[] | null, public DefinedValues: IfcValue[] | null, public Expression: IfcText | null, public DefiningUnit: IfcUnit | null, public DefinedUnit: IfcUnit | null, public CurveInterpolation: IfcCurveInterpolationEnum | null)
	{
		super(expressID,Name, Description);
	}
}
export class IfcPropertyTemplate extends IfcPropertyTemplateDefinition {
	expressID:number=3521284610;
	PartOfComplexTemplate!: (Reference<IfcComplexPropertyTemplate> | IfcComplexPropertyTemplate)[] | null;
	PartOfPsetTemplate!: (Reference<IfcPropertySetTemplate> | IfcPropertySetTemplate)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcProxy extends IfcProduct {
	expressID:number=3219374653;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public ProxyType: IfcObjectTypeEnum , public Tag: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcRectangleHollowProfileDef extends IfcRectangleProfileDef {
	expressID:number=2770003689;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) | null, public XDim: IfcPositiveLengthMeasure , public YDim: IfcPositiveLengthMeasure , public WallThickness: IfcPositiveLengthMeasure , public InnerFilletRadius: IfcNonNegativeLengthMeasure | null, public OuterFilletRadius: IfcNonNegativeLengthMeasure | null)
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
	constructor(expressID: number, public BasisSurface: (Reference<IfcSurface> | IfcSurface) , public U1: IfcParameterValue , public V1: IfcParameterValue , public U2: IfcParameterValue , public V2: IfcParameterValue , public Usense: IfcBoolean , public Vsense: IfcBoolean )
	{
			super(expressID);
	}
}
export class IfcReinforcementDefinitionProperties extends IfcPreDefinedPropertySet {
	expressID:number=3765753017;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public DefinitionType: IfcLabel | null, public ReinforcementSectionDefinitions: (Reference<IfcSectionReinforcementProperties> | IfcSectionReinforcementProperties)[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelAssigns extends IfcRelationship {
	expressID:number=3939117080;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] , public RelatedObjectsType: IfcObjectTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelAssignsToActor extends IfcRelAssigns {
	expressID:number=1683148259;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] , public RelatedObjectsType: IfcObjectTypeEnum | null, public RelatingActor: (Reference<IfcActor> | IfcActor) , public ActingRole: (Reference<IfcActorRole> | IfcActorRole) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects, RelatedObjectsType);
	}
}
export class IfcRelAssignsToControl extends IfcRelAssigns {
	expressID:number=2495723537;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] , public RelatedObjectsType: IfcObjectTypeEnum | null, public RelatingControl: (Reference<IfcControl> | IfcControl) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects, RelatedObjectsType);
	}
}
export class IfcRelAssignsToGroup extends IfcRelAssigns {
	expressID:number=1307041759;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] , public RelatedObjectsType: IfcObjectTypeEnum | null, public RelatingGroup: (Reference<IfcGroup> | IfcGroup) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects, RelatedObjectsType);
	}
}
export class IfcRelAssignsToGroupByFactor extends IfcRelAssignsToGroup {
	expressID:number=1027710054;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] , public RelatedObjectsType: IfcObjectTypeEnum | null, public RelatingGroup: (Reference<IfcGroup> | IfcGroup) , public Factor: IfcRatioMeasure )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects, RelatedObjectsType, RelatingGroup);
	}
}
export class IfcRelAssignsToProcess extends IfcRelAssigns {
	expressID:number=4278684876;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] , public RelatedObjectsType: IfcObjectTypeEnum | null, public RelatingProcess: IfcProcessSelect , public QuantityInProcess: (Reference<IfcMeasureWithUnit> | IfcMeasureWithUnit) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects, RelatedObjectsType);
	}
}
export class IfcRelAssignsToProduct extends IfcRelAssigns {
	expressID:number=2857406711;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] , public RelatedObjectsType: IfcObjectTypeEnum | null, public RelatingProduct: IfcProductSelect )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects, RelatedObjectsType);
	}
}
export class IfcRelAssignsToResource extends IfcRelAssigns {
	expressID:number=205026976;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] , public RelatedObjectsType: IfcObjectTypeEnum | null, public RelatingResource: IfcResourceSelect )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects, RelatedObjectsType);
	}
}
export class IfcRelAssociates extends IfcRelationship {
	expressID:number=1865459582;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: IfcDefinitionSelect[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelAssociatesApproval extends IfcRelAssociates {
	expressID:number=4095574036;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: IfcDefinitionSelect[] , public RelatingApproval: (Reference<IfcApproval> | IfcApproval) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects);
	}
}
export class IfcRelAssociatesClassification extends IfcRelAssociates {
	expressID:number=919958153;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: IfcDefinitionSelect[] , public RelatingClassification: IfcClassificationSelect )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects);
	}
}
export class IfcRelAssociatesConstraint extends IfcRelAssociates {
	expressID:number=2728634034;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: IfcDefinitionSelect[] , public Intent: IfcLabel | null, public RelatingConstraint: (Reference<IfcConstraint> | IfcConstraint) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects);
	}
}
export class IfcRelAssociatesDocument extends IfcRelAssociates {
	expressID:number=982818633;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: IfcDefinitionSelect[] , public RelatingDocument: IfcDocumentSelect )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects);
	}
}
export class IfcRelAssociatesLibrary extends IfcRelAssociates {
	expressID:number=3840914261;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: IfcDefinitionSelect[] , public RelatingLibrary: IfcLibrarySelect )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects);
	}
}
export class IfcRelAssociatesMaterial extends IfcRelAssociates {
	expressID:number=2655215786;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: IfcDefinitionSelect[] , public RelatingMaterial: IfcMaterialSelect )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatedObjects);
	}
}
export class IfcRelConnects extends IfcRelationship {
	expressID:number=826625072;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelConnectsElements extends IfcRelConnects {
	expressID:number=1204542856;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ConnectionGeometry: (Reference<IfcConnectionGeometry> | IfcConnectionGeometry) | null, public RelatingElement: (Reference<IfcElement> | IfcElement) , public RelatedElement: (Reference<IfcElement> | IfcElement) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelConnectsPathElements extends IfcRelConnectsElements {
	expressID:number=3945020480;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ConnectionGeometry: (Reference<IfcConnectionGeometry> | IfcConnectionGeometry) | null, public RelatingElement: (Reference<IfcElement> | IfcElement) , public RelatedElement: (Reference<IfcElement> | IfcElement) , public RelatingPriorities: IfcInteger[] , public RelatedPriorities: IfcInteger[] , public RelatedConnectionType: IfcConnectionTypeEnum , public RelatingConnectionType: IfcConnectionTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ConnectionGeometry, RelatingElement, RelatedElement);
	}
}
export class IfcRelConnectsPortToElement extends IfcRelConnects {
	expressID:number=4201705270;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingPort: (Reference<IfcPort> | IfcPort) , public RelatedElement: (Reference<IfcDistributionElement> | IfcDistributionElement) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelConnectsPorts extends IfcRelConnects {
	expressID:number=3190031847;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingPort: (Reference<IfcPort> | IfcPort) , public RelatedPort: (Reference<IfcPort> | IfcPort) , public RealizingElement: (Reference<IfcElement> | IfcElement) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelConnectsStructuralActivity extends IfcRelConnects {
	expressID:number=2127690289;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingElement: IfcStructuralActivityAssignmentSelect , public RelatedStructuralActivity: (Reference<IfcStructuralActivity> | IfcStructuralActivity) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelConnectsStructuralMember extends IfcRelConnects {
	expressID:number=1638771189;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingStructuralMember: (Reference<IfcStructuralMember> | IfcStructuralMember) , public RelatedStructuralConnection: (Reference<IfcStructuralConnection> | IfcStructuralConnection) , public AppliedCondition: (Reference<IfcBoundaryCondition> | IfcBoundaryCondition) | null, public AdditionalConditions: (Reference<IfcStructuralConnectionCondition> | IfcStructuralConnectionCondition) | null, public SupportedLength: IfcLengthMeasure | null, public ConditionCoordinateSystem: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelConnectsWithEccentricity extends IfcRelConnectsStructuralMember {
	expressID:number=504942748;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingStructuralMember: (Reference<IfcStructuralMember> | IfcStructuralMember) , public RelatedStructuralConnection: (Reference<IfcStructuralConnection> | IfcStructuralConnection) , public AppliedCondition: (Reference<IfcBoundaryCondition> | IfcBoundaryCondition) | null, public AdditionalConditions: (Reference<IfcStructuralConnectionCondition> | IfcStructuralConnectionCondition) | null, public SupportedLength: IfcLengthMeasure | null, public ConditionCoordinateSystem: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) | null, public ConnectionConstraint: (Reference<IfcConnectionGeometry> | IfcConnectionGeometry) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatingStructuralMember, RelatedStructuralConnection, AppliedCondition, AdditionalConditions, SupportedLength, ConditionCoordinateSystem);
	}
}
export class IfcRelConnectsWithRealizingElements extends IfcRelConnectsElements {
	expressID:number=3678494232;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ConnectionGeometry: (Reference<IfcConnectionGeometry> | IfcConnectionGeometry) | null, public RelatingElement: (Reference<IfcElement> | IfcElement) , public RelatedElement: (Reference<IfcElement> | IfcElement) , public RealizingElements: (Reference<IfcElement> | IfcElement)[] , public ConnectionType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ConnectionGeometry, RelatingElement, RelatedElement);
	}
}
export class IfcRelContainedInSpatialStructure extends IfcRelConnects {
	expressID:number=3242617779;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatedElements: (Reference<IfcProduct> | IfcProduct)[] , public RelatingStructure: (Reference<IfcSpatialElement> | IfcSpatialElement) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelCoversBldgElements extends IfcRelConnects {
	expressID:number=886880790;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingBuildingElement: (Reference<IfcElement> | IfcElement) , public RelatedCoverings: (Reference<IfcCovering> | IfcCovering)[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelCoversSpaces extends IfcRelConnects {
	expressID:number=2802773753;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingSpace: (Reference<IfcSpace> | IfcSpace) , public RelatedCoverings: (Reference<IfcCovering> | IfcCovering)[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelDeclares extends IfcRelationship {
	expressID:number=2565941209;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingContext: (Reference<IfcContext> | IfcContext) , public RelatedDefinitions: IfcDefinitionSelect[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelDecomposes extends IfcRelationship {
	expressID:number=2551354335;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelDefines extends IfcRelationship {
	expressID:number=693640335;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelDefinesByObject extends IfcRelDefines {
	expressID:number=1462361463;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObject> | IfcObject)[] , public RelatingObject: (Reference<IfcObject> | IfcObject) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelDefinesByProperties extends IfcRelDefines {
	expressID:number=4186316022;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] , public RelatingPropertyDefinition: IfcPropertySetDefinitionSelect )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelDefinesByTemplate extends IfcRelDefines {
	expressID:number=307848117;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatedPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] , public RelatingTemplate: (Reference<IfcPropertySetTemplate> | IfcPropertySetTemplate) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelDefinesByType extends IfcRelDefines {
	expressID:number=781010003;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: (Reference<IfcObject> | IfcObject)[] , public RelatingType: (Reference<IfcTypeObject> | IfcTypeObject) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelFillsElement extends IfcRelConnects {
	expressID:number=3940055652;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingOpeningElement: (Reference<IfcOpeningElement> | IfcOpeningElement) , public RelatedBuildingElement: (Reference<IfcElement> | IfcElement) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelFlowControlElements extends IfcRelConnects {
	expressID:number=279856033;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatedControlElements: (Reference<IfcDistributionControlElement> | IfcDistributionControlElement)[] , public RelatingFlowElement: (Reference<IfcDistributionFlowElement> | IfcDistributionFlowElement) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelInterferesElements extends IfcRelConnects {
	expressID:number=427948657;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingElement: (Reference<IfcElement> | IfcElement) , public RelatedElement: (Reference<IfcElement> | IfcElement) , public InterferenceGeometry: (Reference<IfcConnectionGeometry> | IfcConnectionGeometry) | null, public InterferenceType: IfcIdentifier | null, public ImpliedOrder: boolean )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelNests extends IfcRelDecomposes {
	expressID:number=3268803585;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingObject: (Reference<IfcObjectDefinition> | IfcObjectDefinition) , public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelProjectsElement extends IfcRelDecomposes {
	expressID:number=750771296;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingElement: (Reference<IfcElement> | IfcElement) , public RelatedFeatureElement: (Reference<IfcFeatureElementAddition> | IfcFeatureElementAddition) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelReferencedInSpatialStructure extends IfcRelConnects {
	expressID:number=1245217292;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatedElements: (Reference<IfcProduct> | IfcProduct)[] , public RelatingStructure: (Reference<IfcSpatialElement> | IfcSpatialElement) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelSequence extends IfcRelConnects {
	expressID:number=4122056220;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingProcess: (Reference<IfcProcess> | IfcProcess) , public RelatedProcess: (Reference<IfcProcess> | IfcProcess) , public TimeLag: (Reference<IfcLagTime> | IfcLagTime) | null, public SequenceType: IfcSequenceEnum | null, public UserDefinedSequenceType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelServicesBuildings extends IfcRelConnects {
	expressID:number=366585022;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingSystem: (Reference<IfcSystem> | IfcSystem) , public RelatedBuildings: (Reference<IfcSpatialElement> | IfcSpatialElement)[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelSpaceBoundary extends IfcRelConnects {
	expressID:number=3451746338;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingSpace: IfcSpaceBoundarySelect , public RelatedBuildingElement: (Reference<IfcElement> | IfcElement) , public ConnectionGeometry: (Reference<IfcConnectionGeometry> | IfcConnectionGeometry) | null, public PhysicalOrVirtualBoundary: IfcPhysicalOrVirtualEnum , public InternalOrExternalBoundary: IfcInternalOrExternalEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelSpaceBoundary1stLevel extends IfcRelSpaceBoundary {
	expressID:number=3523091289;
	InnerBoundaries!: (Reference<IfcRelSpaceBoundary1stLevel> | IfcRelSpaceBoundary1stLevel)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingSpace: IfcSpaceBoundarySelect , public RelatedBuildingElement: (Reference<IfcElement> | IfcElement) , public ConnectionGeometry: (Reference<IfcConnectionGeometry> | IfcConnectionGeometry) | null, public PhysicalOrVirtualBoundary: IfcPhysicalOrVirtualEnum , public InternalOrExternalBoundary: IfcInternalOrExternalEnum , public ParentBoundary: (Reference<IfcRelSpaceBoundary1stLevel> | IfcRelSpaceBoundary1stLevel) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatingSpace, RelatedBuildingElement, ConnectionGeometry, PhysicalOrVirtualBoundary, InternalOrExternalBoundary);
	}
}
export class IfcRelSpaceBoundary2ndLevel extends IfcRelSpaceBoundary1stLevel {
	expressID:number=1521410863;
	Corresponds!: (Reference<IfcRelSpaceBoundary2ndLevel> | IfcRelSpaceBoundary2ndLevel)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingSpace: IfcSpaceBoundarySelect , public RelatedBuildingElement: (Reference<IfcElement> | IfcElement) , public ConnectionGeometry: (Reference<IfcConnectionGeometry> | IfcConnectionGeometry) | null, public PhysicalOrVirtualBoundary: IfcPhysicalOrVirtualEnum , public InternalOrExternalBoundary: IfcInternalOrExternalEnum , public ParentBoundary: (Reference<IfcRelSpaceBoundary1stLevel> | IfcRelSpaceBoundary1stLevel) | null, public CorrespondingBoundary: (Reference<IfcRelSpaceBoundary2ndLevel> | IfcRelSpaceBoundary2ndLevel) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, RelatingSpace, RelatedBuildingElement, ConnectionGeometry, PhysicalOrVirtualBoundary, InternalOrExternalBoundary, ParentBoundary);
	}
}
export class IfcRelVoidsElement extends IfcRelDecomposes {
	expressID:number=1401173127;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingBuildingElement: (Reference<IfcElement> | IfcElement) , public RelatedOpeningElement: (Reference<IfcFeatureElementSubtraction> | IfcFeatureElementSubtraction) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcReparametrisedCompositeCurveSegment extends IfcCompositeCurveSegment {
	expressID:number=816062949;
	constructor(expressID: number, public Transition: IfcTransitionCode , public SameSense: IfcBoolean , public ParentCurve: (Reference<IfcCurve> | IfcCurve) , public ParamLength: IfcParameterValue )
	{
		super(expressID,Transition, SameSense, ParentCurve);
	}
}
export class IfcResource extends IfcObject {
	expressID:number=2914609552;
	ResourceOf!: (Reference<IfcRelAssignsToResource> | IfcRelAssignsToResource)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identification: IfcIdentifier | null, public LongDescription: IfcText | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcRevolvedAreaSolid extends IfcSweptAreaSolid {
	expressID:number=1856042241;
	constructor(expressID: number, public SweptArea: (Reference<IfcProfileDef> | IfcProfileDef) , public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) | null, public Axis: (Reference<IfcAxis1Placement> | IfcAxis1Placement) , public Angle: IfcPlaneAngleMeasure )
	{
		super(expressID,SweptArea, Position);
	}
}
export class IfcRevolvedAreaSolidTapered extends IfcRevolvedAreaSolid {
	expressID:number=3243963512;
	constructor(expressID: number, public SweptArea: (Reference<IfcProfileDef> | IfcProfileDef) , public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) | null, public Axis: (Reference<IfcAxis1Placement> | IfcAxis1Placement) , public Angle: IfcPlaneAngleMeasure , public EndSweptArea: (Reference<IfcProfileDef> | IfcProfileDef) )
	{
		super(expressID,SweptArea, Position, Axis, Angle);
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
export class IfcSimplePropertyTemplate extends IfcPropertyTemplate {
	expressID:number=3663146110;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public TemplateType: IfcSimplePropertyTemplateTypeEnum | null, public PrimaryMeasureType: IfcLabel | null, public SecondaryMeasureType: IfcLabel | null, public Enumerators: (Reference<IfcPropertyEnumeration> | IfcPropertyEnumeration) | null, public PrimaryUnit: IfcUnit | null, public SecondaryUnit: IfcUnit | null, public Expression: IfcLabel | null, public AccessState: IfcStateEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcSpatialElement extends IfcProduct {
	expressID:number=1412071761;
	ContainsElements!: (Reference<IfcRelContainedInSpatialStructure> | IfcRelContainedInSpatialStructure)[] | null;
	ServicedBySystems!: (Reference<IfcRelServicesBuildings> | IfcRelServicesBuildings)[] | null;
	ReferencesElements!: (Reference<IfcRelReferencedInSpatialStructure> | IfcRelReferencedInSpatialStructure)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcSpatialElementType extends IfcTypeProduct {
	expressID:number=710998568;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag);
	}
}
export class IfcSpatialStructureElement extends IfcSpatialElement {
	expressID:number=2706606064;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public CompositionType: IfcElementCompositionEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName);
	}
}
export class IfcSpatialStructureElementType extends IfcSpatialElementType {
	expressID:number=3893378262;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcSpatialZone extends IfcSpatialElement {
	expressID:number=463610769;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public PredefinedType: IfcSpatialZoneTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName);
	}
}
export class IfcSpatialZoneType extends IfcSpatialElementType {
	expressID:number=2481509218;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcSpatialZoneTypeEnum , public LongName: IfcLabel | null)
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
export class IfcSphericalSurface extends IfcElementarySurface {
	expressID:number=4015995234;
	constructor(expressID: number, public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) , public Radius: IfcPositiveLengthMeasure )
	{
		super(expressID,Position);
	}
}
export class IfcStructuralActivity extends IfcProduct {
	expressID:number=3544373492;
	AssignedToStructuralItem!: (Reference<IfcRelConnectsStructuralActivity> | IfcRelConnectsStructuralActivity)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedLoad: (Reference<IfcStructuralLoad> | IfcStructuralLoad) , public GlobalOrLocal: IfcGlobalOrLocalEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcStructuralItem extends IfcProduct {
	expressID:number=3136571912;
	AssignedStructuralActivity!: (Reference<IfcRelConnectsStructuralActivity> | IfcRelConnectsStructuralActivity)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcStructuralMember extends IfcStructuralItem {
	expressID:number=530289379;
	ConnectedBy!: (Reference<IfcRelConnectsStructuralMember> | IfcRelConnectsStructuralMember)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcStructuralReaction extends IfcStructuralActivity {
	expressID:number=3689010777;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedLoad: (Reference<IfcStructuralLoad> | IfcStructuralLoad) , public GlobalOrLocal: IfcGlobalOrLocalEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, AppliedLoad, GlobalOrLocal);
	}
}
export class IfcStructuralSurfaceMember extends IfcStructuralMember {
	expressID:number=3979015343;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public PredefinedType: IfcStructuralSurfaceMemberTypeEnum , public Thickness: IfcPositiveLengthMeasure | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcStructuralSurfaceMemberVarying extends IfcStructuralSurfaceMember {
	expressID:number=2218152070;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public PredefinedType: IfcStructuralSurfaceMemberTypeEnum , public Thickness: IfcPositiveLengthMeasure | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, PredefinedType, Thickness);
	}
}
export class IfcStructuralSurfaceReaction extends IfcStructuralReaction {
	expressID:number=603775116;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedLoad: (Reference<IfcStructuralLoad> | IfcStructuralLoad) , public GlobalOrLocal: IfcGlobalOrLocalEnum , public PredefinedType: IfcStructuralSurfaceActivityTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, AppliedLoad, GlobalOrLocal);
	}
}
export class IfcSubContractResourceType extends IfcConstructionResourceType {
	expressID:number=4095615324;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public Identification: IfcIdentifier | null, public LongDescription: IfcText | null, public ResourceType: IfcLabel | null, public BaseCosts: (Reference<IfcAppliedValue> | IfcAppliedValue)[] | null, public BaseQuantity: (Reference<IfcPhysicalQuantity> | IfcPhysicalQuantity) | null, public PredefinedType: IfcSubContractResourceTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, Identification, LongDescription, ResourceType, BaseCosts, BaseQuantity);
	}
}
export class IfcSurfaceCurve extends IfcCurve {
	expressID:number=699246055;
	constructor(expressID: number, public Curve3D: (Reference<IfcCurve> | IfcCurve) , public AssociatedGeometry: (Reference<IfcPcurve> | IfcPcurve)[] , public MasterRepresentation: IfcPreferredSurfaceCurveRepresentation )
	{
			super(expressID);
	}
}
export class IfcSurfaceCurveSweptAreaSolid extends IfcSweptAreaSolid {
	expressID:number=2028607225;
	constructor(expressID: number, public SweptArea: (Reference<IfcProfileDef> | IfcProfileDef) , public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) | null, public Directrix: (Reference<IfcCurve> | IfcCurve) , public StartParam: IfcParameterValue | null, public EndParam: IfcParameterValue | null, public ReferenceSurface: (Reference<IfcSurface> | IfcSurface) )
	{
		super(expressID,SweptArea, Position);
	}
}
export class IfcSurfaceOfLinearExtrusion extends IfcSweptSurface {
	expressID:number=2809605785;
	constructor(expressID: number, public SweptCurve: (Reference<IfcProfileDef> | IfcProfileDef) , public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) | null, public ExtrudedDirection: (Reference<IfcDirection> | IfcDirection) , public Depth: IfcLengthMeasure )
	{
		super(expressID,SweptCurve, Position);
	}
}
export class IfcSurfaceOfRevolution extends IfcSweptSurface {
	expressID:number=4124788165;
	constructor(expressID: number, public SweptCurve: (Reference<IfcProfileDef> | IfcProfileDef) , public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) | null, public AxisPosition: (Reference<IfcAxis1Placement> | IfcAxis1Placement) )
	{
		super(expressID,SweptCurve, Position);
	}
}
export class IfcSystemFurnitureElementType extends IfcFurnishingElementType {
	expressID:number=1580310250;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcSystemFurnitureElementTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcTask extends IfcProcess {
	expressID:number=3473067441;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identification: IfcIdentifier | null, public LongDescription: IfcText | null, public Status: IfcLabel | null, public WorkMethod: IfcLabel | null, public IsMilestone: IfcBoolean , public Priority: IfcInteger | null, public TaskTime: (Reference<IfcTaskTime> | IfcTaskTime) | null, public PredefinedType: IfcTaskTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, Identification, LongDescription);
	}
}
export class IfcTaskType extends IfcTypeProcess {
	expressID:number=3206491090;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public Identification: IfcIdentifier | null, public LongDescription: IfcText | null, public ProcessType: IfcLabel | null, public PredefinedType: IfcTaskTypeEnum , public WorkMethod: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, Identification, LongDescription, ProcessType);
	}
}
export class IfcTessellatedFaceSet extends IfcTessellatedItem {
	expressID:number=2387106220;
	HasColours!: (Reference<IfcIndexedColourMap> | IfcIndexedColourMap)[] | null;
	HasTextures!: (Reference<IfcIndexedTextureMap> | IfcIndexedTextureMap)[] | null;
	constructor(expressID: number, public Coordinates: (Reference<IfcCartesianPointList3D> | IfcCartesianPointList3D) )
	{
			super(expressID);
	}
}
export class IfcToroidalSurface extends IfcElementarySurface {
	expressID:number=1935646853;
	constructor(expressID: number, public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) , public MajorRadius: IfcPositiveLengthMeasure , public MinorRadius: IfcPositiveLengthMeasure )
	{
		super(expressID,Position);
	}
}
export class IfcTransportElementType extends IfcElementType {
	expressID:number=2097647324;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcTransportElementTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcTriangulatedFaceSet extends IfcTessellatedFaceSet {
	expressID:number=2916149573;
	constructor(expressID: number, public Coordinates: (Reference<IfcCartesianPointList3D> | IfcCartesianPointList3D) , public Normals: IfcParameterValue[] | null, public Closed: IfcBoolean | null, public CoordIndex: IfcPositiveInteger[] , public PnIndex: IfcPositiveInteger[] | null)
	{
		super(expressID,Coordinates);
	}
}
export class IfcWindowLiningProperties extends IfcPreDefinedPropertySet {
	expressID:number=336235671;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public LiningDepth: IfcPositiveLengthMeasure | null, public LiningThickness: IfcNonNegativeLengthMeasure | null, public TransomThickness: IfcNonNegativeLengthMeasure | null, public MullionThickness: IfcNonNegativeLengthMeasure | null, public FirstTransomOffset: IfcNormalisedRatioMeasure | null, public SecondTransomOffset: IfcNormalisedRatioMeasure | null, public FirstMullionOffset: IfcNormalisedRatioMeasure | null, public SecondMullionOffset: IfcNormalisedRatioMeasure | null, public ShapeAspectStyle: (Reference<IfcShapeAspect> | IfcShapeAspect) | null, public LiningOffset: IfcLengthMeasure | null, public LiningToPanelOffsetX: IfcLengthMeasure | null, public LiningToPanelOffsetY: IfcLengthMeasure | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcWindowPanelProperties extends IfcPreDefinedPropertySet {
	expressID:number=512836454;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public OperationType: IfcWindowPanelOperationEnum , public PanelPosition: IfcWindowPanelPositionEnum , public FrameDepth: IfcPositiveLengthMeasure | null, public FrameThickness: IfcPositiveLengthMeasure | null, public ShapeAspectStyle: (Reference<IfcShapeAspect> | IfcShapeAspect) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcActor extends IfcObject {
	expressID:number=2296667514;
	IsActingUpon!: (Reference<IfcRelAssignsToActor> | IfcRelAssignsToActor)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public TheActor: IfcActorSelect )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcAdvancedBrep extends IfcManifoldSolidBrep {
	expressID:number=1635779807;
	constructor(expressID: number, public Outer: (Reference<IfcClosedShell> | IfcClosedShell) )
	{
		super(expressID,Outer);
	}
}
export class IfcAdvancedBrepWithVoids extends IfcAdvancedBrep {
	expressID:number=2603310189;
	constructor(expressID: number, public Outer: (Reference<IfcClosedShell> | IfcClosedShell) , public Voids: (Reference<IfcClosedShell> | IfcClosedShell)[] )
	{
		super(expressID,Outer);
	}
}
export class IfcAnnotation extends IfcProduct {
	expressID:number=1674181508;
	ContainedInStructure!: (Reference<IfcRelContainedInSpatialStructure> | IfcRelContainedInSpatialStructure)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcBSplineSurface extends IfcBoundedSurface {
	expressID:number=2887950389;
	constructor(expressID: number, public UDegree: IfcInteger , public VDegree: IfcInteger , public ControlPointsList: (Reference<IfcCartesianPoint> | IfcCartesianPoint)[] , public SurfaceForm: IfcBSplineSurfaceForm , public UClosed: IfcLogical , public VClosed: IfcLogical , public SelfIntersect: IfcLogical )
	{
			super(expressID);
	}
}
export class IfcBSplineSurfaceWithKnots extends IfcBSplineSurface {
	expressID:number=167062518;
	constructor(expressID: number, public UDegree: IfcInteger , public VDegree: IfcInteger , public ControlPointsList: (Reference<IfcCartesianPoint> | IfcCartesianPoint)[] , public SurfaceForm: IfcBSplineSurfaceForm , public UClosed: IfcLogical , public VClosed: IfcLogical , public SelfIntersect: IfcLogical , public UMultiplicities: IfcInteger[] , public VMultiplicities: IfcInteger[] , public UKnots: IfcParameterValue[] , public VKnots: IfcParameterValue[] , public KnotSpec: IfcKnotType )
	{
		super(expressID,UDegree, VDegree, ControlPointsList, SurfaceForm, UClosed, VClosed, SelfIntersect);
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
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public CompositionType: IfcElementCompositionEnum | null, public ElevationOfRefHeight: IfcLengthMeasure | null, public ElevationOfTerrain: IfcLengthMeasure | null, public BuildingAddress: (Reference<IfcPostalAddress> | IfcPostalAddress) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName, CompositionType);
	}
}
export class IfcBuildingElementType extends IfcElementType {
	expressID:number=1950629157;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcBuildingStorey extends IfcSpatialStructureElement {
	expressID:number=3124254112;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public CompositionType: IfcElementCompositionEnum | null, public Elevation: IfcLengthMeasure | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName, CompositionType);
	}
}
export class IfcChimneyType extends IfcBuildingElementType {
	expressID:number=2197970202;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcChimneyTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcCircleHollowProfileDef extends IfcCircleProfileDef {
	expressID:number=2937912522;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public Position: (Reference<IfcAxis2Placement2D> | IfcAxis2Placement2D) | null, public Radius: IfcPositiveLengthMeasure , public WallThickness: IfcPositiveLengthMeasure )
	{
		super(expressID,ProfileType, ProfileName, Position, Radius);
	}
}
export class IfcCivilElementType extends IfcElementType {
	expressID:number=3893394355;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcColumnType extends IfcBuildingElementType {
	expressID:number=300633059;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcColumnTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcComplexPropertyTemplate extends IfcPropertyTemplate {
	expressID:number=3875453745;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public UsageName: IfcLabel | null, public TemplateType: IfcComplexPropertyTemplateTypeEnum | null, public HasPropertyTemplates: (Reference<IfcPropertyTemplate> | IfcPropertyTemplate)[] | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcCompositeCurve extends IfcBoundedCurve {
	expressID:number=3732776249;
	constructor(expressID: number, public Segments: (Reference<IfcCompositeCurveSegment> | IfcCompositeCurveSegment)[] , public SelfIntersect: IfcLogical )
	{
			super(expressID);
	}
}
export class IfcCompositeCurveOnSurface extends IfcCompositeCurve {
	expressID:number=15328376;
	constructor(expressID: number, public Segments: (Reference<IfcCompositeCurveSegment> | IfcCompositeCurveSegment)[] , public SelfIntersect: IfcLogical )
	{
		super(expressID,Segments, SelfIntersect);
	}
}
export class IfcConic extends IfcCurve {
	expressID:number=2510884976;
	constructor(expressID: number, public Position: IfcAxis2Placement )
	{
			super(expressID);
	}
}
export class IfcConstructionEquipmentResourceType extends IfcConstructionResourceType {
	expressID:number=2185764099;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public Identification: IfcIdentifier | null, public LongDescription: IfcText | null, public ResourceType: IfcLabel | null, public BaseCosts: (Reference<IfcAppliedValue> | IfcAppliedValue)[] | null, public BaseQuantity: (Reference<IfcPhysicalQuantity> | IfcPhysicalQuantity) | null, public PredefinedType: IfcConstructionEquipmentResourceTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, Identification, LongDescription, ResourceType, BaseCosts, BaseQuantity);
	}
}
export class IfcConstructionMaterialResourceType extends IfcConstructionResourceType {
	expressID:number=4105962743;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public Identification: IfcIdentifier | null, public LongDescription: IfcText | null, public ResourceType: IfcLabel | null, public BaseCosts: (Reference<IfcAppliedValue> | IfcAppliedValue)[] | null, public BaseQuantity: (Reference<IfcPhysicalQuantity> | IfcPhysicalQuantity) | null, public PredefinedType: IfcConstructionMaterialResourceTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, Identification, LongDescription, ResourceType, BaseCosts, BaseQuantity);
	}
}
export class IfcConstructionProductResourceType extends IfcConstructionResourceType {
	expressID:number=1525564444;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public Identification: IfcIdentifier | null, public LongDescription: IfcText | null, public ResourceType: IfcLabel | null, public BaseCosts: (Reference<IfcAppliedValue> | IfcAppliedValue)[] | null, public BaseQuantity: (Reference<IfcPhysicalQuantity> | IfcPhysicalQuantity) | null, public PredefinedType: IfcConstructionProductResourceTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, Identification, LongDescription, ResourceType, BaseCosts, BaseQuantity);
	}
}
export class IfcConstructionResource extends IfcResource {
	expressID:number=2559216714;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identification: IfcIdentifier | null, public LongDescription: IfcText | null, public Usage: (Reference<IfcResourceTime> | IfcResourceTime) | null, public BaseCosts: (Reference<IfcAppliedValue> | IfcAppliedValue)[] | null, public BaseQuantity: (Reference<IfcPhysicalQuantity> | IfcPhysicalQuantity) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, Identification, LongDescription);
	}
}
export class IfcControl extends IfcObject {
	expressID:number=3293443760;
	Controls!: (Reference<IfcRelAssignsToControl> | IfcRelAssignsToControl)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identification: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcCostItem extends IfcControl {
	expressID:number=3895139033;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identification: IfcIdentifier | null, public PredefinedType: IfcCostItemTypeEnum | null, public CostValues: (Reference<IfcCostValue> | IfcCostValue)[] | null, public CostQuantities: (Reference<IfcPhysicalQuantity> | IfcPhysicalQuantity)[] | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, Identification);
	}
}
export class IfcCostSchedule extends IfcControl {
	expressID:number=1419761937;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identification: IfcIdentifier | null, public PredefinedType: IfcCostScheduleTypeEnum | null, public Status: IfcLabel | null, public SubmittedOn: IfcDateTime | null, public UpdateDate: IfcDateTime | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, Identification);
	}
}
export class IfcCoveringType extends IfcBuildingElementType {
	expressID:number=1916426348;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcCoveringTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcCrewResource extends IfcConstructionResource {
	expressID:number=3295246426;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identification: IfcIdentifier | null, public LongDescription: IfcText | null, public Usage: (Reference<IfcResourceTime> | IfcResourceTime) | null, public BaseCosts: (Reference<IfcAppliedValue> | IfcAppliedValue)[] | null, public BaseQuantity: (Reference<IfcPhysicalQuantity> | IfcPhysicalQuantity) | null, public PredefinedType: IfcCrewResourceTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, Identification, LongDescription, Usage, BaseCosts, BaseQuantity);
	}
}
export class IfcCurtainWallType extends IfcBuildingElementType {
	expressID:number=1457835157;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcCurtainWallTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcCylindricalSurface extends IfcElementarySurface {
	expressID:number=1213902940;
	constructor(expressID: number, public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) , public Radius: IfcPositiveLengthMeasure )
	{
		super(expressID,Position);
	}
}
export class IfcDistributionElementType extends IfcElementType {
	expressID:number=3256556792;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcDistributionFlowElementType extends IfcDistributionElementType {
	expressID:number=3849074793;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcDoorLiningProperties extends IfcPreDefinedPropertySet {
	expressID:number=2963535650;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public LiningDepth: IfcPositiveLengthMeasure | null, public LiningThickness: IfcNonNegativeLengthMeasure | null, public ThresholdDepth: IfcPositiveLengthMeasure | null, public ThresholdThickness: IfcNonNegativeLengthMeasure | null, public TransomThickness: IfcNonNegativeLengthMeasure | null, public TransomOffset: IfcLengthMeasure | null, public LiningOffset: IfcLengthMeasure | null, public ThresholdOffset: IfcLengthMeasure | null, public CasingThickness: IfcPositiveLengthMeasure | null, public CasingDepth: IfcPositiveLengthMeasure | null, public ShapeAspectStyle: (Reference<IfcShapeAspect> | IfcShapeAspect) | null, public LiningToPanelOffsetX: IfcLengthMeasure | null, public LiningToPanelOffsetY: IfcLengthMeasure | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcDoorPanelProperties extends IfcPreDefinedPropertySet {
	expressID:number=1714330368;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public PanelDepth: IfcPositiveLengthMeasure | null, public PanelOperation: IfcDoorPanelOperationEnum , public PanelWidth: IfcNormalisedRatioMeasure | null, public PanelPosition: IfcDoorPanelPositionEnum , public ShapeAspectStyle: (Reference<IfcShapeAspect> | IfcShapeAspect) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcDoorType extends IfcBuildingElementType {
	expressID:number=2323601079;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcDoorTypeEnum , public OperationType: IfcDoorTypeOperationEnum , public ParameterTakesPrecedence: IfcBoolean | null, public UserDefinedOperationType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
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
export class IfcElement extends IfcProduct {
	expressID:number=1758889154;
	FillsVoids!: (Reference<IfcRelFillsElement> | IfcRelFillsElement)[] | null;
	ConnectedTo!: (Reference<IfcRelConnectsElements> | IfcRelConnectsElements)[] | null;
	IsInterferedByElements!: (Reference<IfcRelInterferesElements> | IfcRelInterferesElements)[] | null;
	InterferesElements!: (Reference<IfcRelInterferesElements> | IfcRelInterferesElements)[] | null;
	HasProjections!: (Reference<IfcRelProjectsElement> | IfcRelProjectsElement)[] | null;
	ReferencedInStructures!: (Reference<IfcRelReferencedInSpatialStructure> | IfcRelReferencedInSpatialStructure)[] | null;
	HasOpenings!: (Reference<IfcRelVoidsElement> | IfcRelVoidsElement)[] | null;
	IsConnectionRealization!: (Reference<IfcRelConnectsWithRealizingElements> | IfcRelConnectsWithRealizingElements)[] | null;
	ProvidesBoundaries!: (Reference<IfcRelSpaceBoundary> | IfcRelSpaceBoundary)[] | null;
	ConnectedFrom!: (Reference<IfcRelConnectsElements> | IfcRelConnectsElements)[] | null;
	ContainedInStructure!: (Reference<IfcRelContainedInSpatialStructure> | IfcRelContainedInSpatialStructure)[] | null;
	HasCoverings!: (Reference<IfcRelCoversBldgElements> | IfcRelCoversBldgElements)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcElementAssembly extends IfcElement {
	expressID:number=4123344466;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public AssemblyPlace: IfcAssemblyPlaceEnum | null, public PredefinedType: IfcElementAssemblyTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcElementAssemblyType extends IfcElementType {
	expressID:number=2397081782;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcElementAssemblyTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcElementComponent extends IfcElement {
	expressID:number=1623761950;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcElementComponentType extends IfcElementType {
	expressID:number=2590856083;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
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
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcEngineType extends IfcEnergyConversionDeviceType {
	expressID:number=132023988;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcEngineTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcEvaporativeCoolerType extends IfcEnergyConversionDeviceType {
	expressID:number=3174744832;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcEvaporativeCoolerTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcEvaporatorType extends IfcEnergyConversionDeviceType {
	expressID:number=3390157468;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcEvaporatorTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcEvent extends IfcProcess {
	expressID:number=4148101412;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identification: IfcIdentifier | null, public LongDescription: IfcText | null, public PredefinedType: IfcEventTypeEnum | null, public EventTriggerType: IfcEventTriggerTypeEnum | null, public UserDefinedEventTriggerType: IfcLabel | null, public EventOccurenceTime: (Reference<IfcEventTime> | IfcEventTime) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, Identification, LongDescription);
	}
}
export class IfcExternalSpatialStructureElement extends IfcSpatialElement {
	expressID:number=2853485674;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName);
	}
}
export class IfcFacetedBrep extends IfcManifoldSolidBrep {
	expressID:number=807026263;
	constructor(expressID: number, public Outer: (Reference<IfcClosedShell> | IfcClosedShell) )
	{
		super(expressID,Outer);
	}
}
export class IfcFacetedBrepWithVoids extends IfcFacetedBrep {
	expressID:number=3737207727;
	constructor(expressID: number, public Outer: (Reference<IfcClosedShell> | IfcClosedShell) , public Voids: (Reference<IfcClosedShell> | IfcClosedShell)[] )
	{
		super(expressID,Outer);
	}
}
export class IfcFastener extends IfcElementComponent {
	expressID:number=647756555;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcFastenerTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFastenerType extends IfcElementComponentType {
	expressID:number=2489546625;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcFastenerTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFeatureElement extends IfcElement {
	expressID:number=2827207264;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFeatureElementAddition extends IfcFeatureElement {
	expressID:number=2143335405;
	ProjectsElements!: (Reference<IfcRelProjectsElement> | IfcRelProjectsElement) | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFeatureElementSubtraction extends IfcFeatureElement {
	expressID:number=1287392070;
	VoidsElements!: (Reference<IfcRelVoidsElement> | IfcRelVoidsElement) | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFlowControllerType extends IfcDistributionFlowElementType {
	expressID:number=3907093117;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFlowFittingType extends IfcDistributionFlowElementType {
	expressID:number=3198132628;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFlowMeterType extends IfcFlowControllerType {
	expressID:number=3815607619;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcFlowMeterTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFlowMovingDeviceType extends IfcDistributionFlowElementType {
	expressID:number=1482959167;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFlowSegmentType extends IfcDistributionFlowElementType {
	expressID:number=1834744321;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFlowStorageDeviceType extends IfcDistributionFlowElementType {
	expressID:number=1339347760;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFlowTerminalType extends IfcDistributionFlowElementType {
	expressID:number=2297155007;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFlowTreatmentDeviceType extends IfcDistributionFlowElementType {
	expressID:number=3009222698;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFootingType extends IfcBuildingElementType {
	expressID:number=1893162501;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcFootingTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFurnishingElement extends IfcElement {
	expressID:number=263784265;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFurniture extends IfcFurnishingElement {
	expressID:number=1509553395;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcFurnitureTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcGeographicElement extends IfcElement {
	expressID:number=3493046030;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcGeographicElementTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcGrid extends IfcProduct {
	expressID:number=3009204131;
	ContainedInStructure!: (Reference<IfcRelContainedInSpatialStructure> | IfcRelContainedInSpatialStructure)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public UAxes: (Reference<IfcGridAxis> | IfcGridAxis)[] , public VAxes: (Reference<IfcGridAxis> | IfcGridAxis)[] , public WAxes: (Reference<IfcGridAxis> | IfcGridAxis)[] | null, public PredefinedType: IfcGridTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcGroup extends IfcObject {
	expressID:number=2706460486;
	IsGroupedBy!: (Reference<IfcRelAssignsToGroup> | IfcRelAssignsToGroup)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcHeatExchangerType extends IfcEnergyConversionDeviceType {
	expressID:number=1251058090;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcHeatExchangerTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcHumidifierType extends IfcEnergyConversionDeviceType {
	expressID:number=1806887404;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcHumidifierTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcIndexedPolyCurve extends IfcBoundedCurve {
	expressID:number=2571569899;
	constructor(expressID: number, public Points: (Reference<IfcCartesianPointList> | IfcCartesianPointList) , public Segments: IfcSegmentIndexSelect[] | null, public SelfIntersect: IfcBoolean | null)
	{
			super(expressID);
	}
}
export class IfcInterceptorType extends IfcFlowTreatmentDeviceType {
	expressID:number=3946677679;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcInterceptorTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcIntersectionCurve extends IfcSurfaceCurve {
	expressID:number=3113134337;
	constructor(expressID: number, public Curve3D: (Reference<IfcCurve> | IfcCurve) , public AssociatedGeometry: (Reference<IfcPcurve> | IfcPcurve)[] , public MasterRepresentation: IfcPreferredSurfaceCurveRepresentation )
	{
		super(expressID,Curve3D, AssociatedGeometry, MasterRepresentation);
	}
}
export class IfcInventory extends IfcGroup {
	expressID:number=2391368822;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public PredefinedType: IfcInventoryTypeEnum | null, public Jurisdiction: IfcActorSelect | null, public ResponsiblePersons: (Reference<IfcPerson> | IfcPerson)[] | null, public LastUpdateDate: IfcDate | null, public CurrentValue: (Reference<IfcCostValue> | IfcCostValue) | null, public OriginalValue: (Reference<IfcCostValue> | IfcCostValue) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcJunctionBoxType extends IfcFlowFittingType {
	expressID:number=4288270099;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcJunctionBoxTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcLaborResource extends IfcConstructionResource {
	expressID:number=3827777499;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identification: IfcIdentifier | null, public LongDescription: IfcText | null, public Usage: (Reference<IfcResourceTime> | IfcResourceTime) | null, public BaseCosts: (Reference<IfcAppliedValue> | IfcAppliedValue)[] | null, public BaseQuantity: (Reference<IfcPhysicalQuantity> | IfcPhysicalQuantity) | null, public PredefinedType: IfcLaborResourceTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, Identification, LongDescription, Usage, BaseCosts, BaseQuantity);
	}
}
export class IfcLampType extends IfcFlowTerminalType {
	expressID:number=1051575348;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcLampTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcLightFixtureType extends IfcFlowTerminalType {
	expressID:number=1161773419;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcLightFixtureTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcMechanicalFastener extends IfcElementComponent {
	expressID:number=377706215;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public NominalDiameter: IfcPositiveLengthMeasure | null, public NominalLength: IfcPositiveLengthMeasure | null, public PredefinedType: IfcMechanicalFastenerTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcMechanicalFastenerType extends IfcElementComponentType {
	expressID:number=2108223431;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcMechanicalFastenerTypeEnum , public NominalDiameter: IfcPositiveLengthMeasure | null, public NominalLength: IfcPositiveLengthMeasure | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcMedicalDeviceType extends IfcFlowTerminalType {
	expressID:number=1114901282;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcMedicalDeviceTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcMemberType extends IfcBuildingElementType {
	expressID:number=3181161470;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcMemberTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcMotorConnectionType extends IfcEnergyConversionDeviceType {
	expressID:number=977012517;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcMotorConnectionTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcOccupant extends IfcActor {
	expressID:number=4143007308;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public TheActor: IfcActorSelect , public PredefinedType: IfcOccupantTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, TheActor);
	}
}
export class IfcOpeningElement extends IfcFeatureElementSubtraction {
	expressID:number=3588315303;
	HasFillings!: (Reference<IfcRelFillsElement> | IfcRelFillsElement)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcOpeningElementTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcOpeningStandardCase extends IfcOpeningElement {
	expressID:number=3079942009;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcOpeningElementTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag, PredefinedType);
	}
}
export class IfcOutletType extends IfcFlowTerminalType {
	expressID:number=2837617999;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcOutletTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcPerformanceHistory extends IfcControl {
	expressID:number=2382730787;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identification: IfcIdentifier | null, public LifeCyclePhase: IfcLabel , public PredefinedType: IfcPerformanceHistoryTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, Identification);
	}
}
export class IfcPermeableCoveringProperties extends IfcPreDefinedPropertySet {
	expressID:number=3566463478;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public OperationType: IfcPermeableCoveringOperationEnum , public PanelPosition: IfcWindowPanelPositionEnum , public FrameDepth: IfcPositiveLengthMeasure | null, public FrameThickness: IfcPositiveLengthMeasure | null, public ShapeAspectStyle: (Reference<IfcShapeAspect> | IfcShapeAspect) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcPermit extends IfcControl {
	expressID:number=3327091369;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identification: IfcIdentifier | null, public PredefinedType: IfcPermitTypeEnum | null, public Status: IfcLabel | null, public LongDescription: IfcText | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, Identification);
	}
}
export class IfcPileType extends IfcBuildingElementType {
	expressID:number=1158309216;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcPileTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcPipeFittingType extends IfcFlowFittingType {
	expressID:number=804291784;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcPipeFittingTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcPipeSegmentType extends IfcFlowSegmentType {
	expressID:number=4231323485;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcPipeSegmentTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcPlateType extends IfcBuildingElementType {
	expressID:number=4017108033;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcPlateTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcPolygonalFaceSet extends IfcTessellatedFaceSet {
	expressID:number=2839578677;
	constructor(expressID: number, public Coordinates: (Reference<IfcCartesianPointList3D> | IfcCartesianPointList3D) , public Closed: IfcBoolean | null, public Faces: (Reference<IfcIndexedPolygonalFace> | IfcIndexedPolygonalFace)[] , public PnIndex: IfcPositiveInteger[] | null)
	{
		super(expressID,Coordinates);
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
	ContainedIn!: (Reference<IfcRelConnectsPortToElement> | IfcRelConnectsPortToElement)[] | null;
	ConnectedFrom!: (Reference<IfcRelConnectsPorts> | IfcRelConnectsPorts)[] | null;
	ConnectedTo!: (Reference<IfcRelConnectsPorts> | IfcRelConnectsPorts)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcProcedure extends IfcProcess {
	expressID:number=2744685151;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identification: IfcIdentifier | null, public LongDescription: IfcText | null, public PredefinedType: IfcProcedureTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, Identification, LongDescription);
	}
}
export class IfcProjectOrder extends IfcControl {
	expressID:number=2904328755;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identification: IfcIdentifier | null, public PredefinedType: IfcProjectOrderTypeEnum | null, public Status: IfcLabel | null, public LongDescription: IfcText | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, Identification);
	}
}
export class IfcProjectionElement extends IfcFeatureElementAddition {
	expressID:number=3651124850;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcProjectionElementTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcProtectiveDeviceType extends IfcFlowControllerType {
	expressID:number=1842657554;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcProtectiveDeviceTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcPumpType extends IfcFlowMovingDeviceType {
	expressID:number=2250791053;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcPumpTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcRailingType extends IfcBuildingElementType {
	expressID:number=2893384427;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcRailingTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcRampFlightType extends IfcBuildingElementType {
	expressID:number=2324767716;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcRampFlightTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcRampType extends IfcBuildingElementType {
	expressID:number=1469900589;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcRampTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcRationalBSplineSurfaceWithKnots extends IfcBSplineSurfaceWithKnots {
	expressID:number=683857671;
	constructor(expressID: number, public UDegree: IfcInteger , public VDegree: IfcInteger , public ControlPointsList: (Reference<IfcCartesianPoint> | IfcCartesianPoint)[] , public SurfaceForm: IfcBSplineSurfaceForm , public UClosed: IfcLogical , public VClosed: IfcLogical , public SelfIntersect: IfcLogical , public UMultiplicities: IfcInteger[] , public VMultiplicities: IfcInteger[] , public UKnots: IfcParameterValue[] , public VKnots: IfcParameterValue[] , public KnotSpec: IfcKnotType , public WeightsData: IfcReal[] )
	{
		super(expressID,UDegree, VDegree, ControlPointsList, SurfaceForm, UClosed, VClosed, SelfIntersect, UMultiplicities, VMultiplicities, UKnots, VKnots, KnotSpec);
	}
}
export class IfcReinforcingElement extends IfcElementComponent {
	expressID:number=3027567501;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public SteelGrade: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcReinforcingElementType extends IfcElementComponentType {
	expressID:number=964333572;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcReinforcingMesh extends IfcReinforcingElement {
	expressID:number=2320036040;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public SteelGrade: IfcLabel | null, public MeshLength: IfcPositiveLengthMeasure | null, public MeshWidth: IfcPositiveLengthMeasure | null, public LongitudinalBarNominalDiameter: IfcPositiveLengthMeasure | null, public TransverseBarNominalDiameter: IfcPositiveLengthMeasure | null, public LongitudinalBarCrossSectionArea: IfcAreaMeasure | null, public TransverseBarCrossSectionArea: IfcAreaMeasure | null, public LongitudinalBarSpacing: IfcPositiveLengthMeasure | null, public TransverseBarSpacing: IfcPositiveLengthMeasure | null, public PredefinedType: IfcReinforcingMeshTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag, SteelGrade);
	}
}
export class IfcReinforcingMeshType extends IfcReinforcingElementType {
	expressID:number=2310774935;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcReinforcingMeshTypeEnum , public MeshLength: IfcPositiveLengthMeasure | null, public MeshWidth: IfcPositiveLengthMeasure | null, public LongitudinalBarNominalDiameter: IfcPositiveLengthMeasure | null, public TransverseBarNominalDiameter: IfcPositiveLengthMeasure | null, public LongitudinalBarCrossSectionArea: IfcAreaMeasure | null, public TransverseBarCrossSectionArea: IfcAreaMeasure | null, public LongitudinalBarSpacing: IfcPositiveLengthMeasure | null, public TransverseBarSpacing: IfcPositiveLengthMeasure | null, public BendingShapeCode: IfcLabel | null, public BendingParameters: IfcBendingParameterSelect[] | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcRelAggregates extends IfcRelDecomposes {
	expressID:number=160246688;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingObject: (Reference<IfcObjectDefinition> | IfcObjectDefinition) , public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRoofType extends IfcBuildingElementType {
	expressID:number=2781568857;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcRoofTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcSanitaryTerminalType extends IfcFlowTerminalType {
	expressID:number=1768891740;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcSanitaryTerminalTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcSeamCurve extends IfcSurfaceCurve {
	expressID:number=2157484638;
	constructor(expressID: number, public Curve3D: (Reference<IfcCurve> | IfcCurve) , public AssociatedGeometry: (Reference<IfcPcurve> | IfcPcurve)[] , public MasterRepresentation: IfcPreferredSurfaceCurveRepresentation )
	{
		super(expressID,Curve3D, AssociatedGeometry, MasterRepresentation);
	}
}
export class IfcShadingDeviceType extends IfcBuildingElementType {
	expressID:number=4074543187;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcShadingDeviceTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcSite extends IfcSpatialStructureElement {
	expressID:number=4097777520;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public CompositionType: IfcElementCompositionEnum | null, public RefLatitude: IfcCompoundPlaneAngleMeasure | null, public RefLongitude: IfcCompoundPlaneAngleMeasure | null, public RefElevation: IfcLengthMeasure | null, public LandTitleNumber: IfcLabel | null, public SiteAddress: (Reference<IfcPostalAddress> | IfcPostalAddress) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName, CompositionType);
	}
}
export class IfcSlabType extends IfcBuildingElementType {
	expressID:number=2533589738;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcSlabTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcSolarDeviceType extends IfcEnergyConversionDeviceType {
	expressID:number=1072016465;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcSolarDeviceTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcSpace extends IfcSpatialStructureElement {
	expressID:number=3856911033;
	HasCoverings!: (Reference<IfcRelCoversSpaces> | IfcRelCoversSpaces)[] | null;
	BoundedBy!: (Reference<IfcRelSpaceBoundary> | IfcRelSpaceBoundary)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public CompositionType: IfcElementCompositionEnum | null, public PredefinedType: IfcSpaceTypeEnum | null, public ElevationWithFlooring: IfcLengthMeasure | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName, CompositionType);
	}
}
export class IfcSpaceHeaterType extends IfcFlowTerminalType {
	expressID:number=1305183839;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcSpaceHeaterTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcSpaceType extends IfcSpatialStructureElementType {
	expressID:number=3812236995;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcSpaceTypeEnum , public LongName: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcStackTerminalType extends IfcFlowTerminalType {
	expressID:number=3112655638;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcStackTerminalTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcStairFlightType extends IfcBuildingElementType {
	expressID:number=1039846685;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcStairFlightTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcStairType extends IfcBuildingElementType {
	expressID:number=338393293;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcStairTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcStructuralAction extends IfcStructuralActivity {
	expressID:number=682877961;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedLoad: (Reference<IfcStructuralLoad> | IfcStructuralLoad) , public GlobalOrLocal: IfcGlobalOrLocalEnum , public DestabilizingLoad: IfcBoolean | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, AppliedLoad, GlobalOrLocal);
	}
}
export class IfcStructuralConnection extends IfcStructuralItem {
	expressID:number=1179482911;
	ConnectsStructuralMembers!: (Reference<IfcRelConnectsStructuralMember> | IfcRelConnectsStructuralMember)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedCondition: (Reference<IfcBoundaryCondition> | IfcBoundaryCondition) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcStructuralCurveAction extends IfcStructuralAction {
	expressID:number=1004757350;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedLoad: (Reference<IfcStructuralLoad> | IfcStructuralLoad) , public GlobalOrLocal: IfcGlobalOrLocalEnum , public DestabilizingLoad: IfcBoolean | null, public ProjectedOrTrue: IfcProjectedOrTrueLengthEnum | null, public PredefinedType: IfcStructuralCurveActivityTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, AppliedLoad, GlobalOrLocal, DestabilizingLoad);
	}
}
export class IfcStructuralCurveConnection extends IfcStructuralConnection {
	expressID:number=4243806635;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedCondition: (Reference<IfcBoundaryCondition> | IfcBoundaryCondition) | null, public Axis: (Reference<IfcDirection> | IfcDirection) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, AppliedCondition);
	}
}
export class IfcStructuralCurveMember extends IfcStructuralMember {
	expressID:number=214636428;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public PredefinedType: IfcStructuralCurveMemberTypeEnum , public Axis: (Reference<IfcDirection> | IfcDirection) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcStructuralCurveMemberVarying extends IfcStructuralCurveMember {
	expressID:number=2445595289;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public PredefinedType: IfcStructuralCurveMemberTypeEnum , public Axis: (Reference<IfcDirection> | IfcDirection) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, PredefinedType, Axis);
	}
}
export class IfcStructuralCurveReaction extends IfcStructuralReaction {
	expressID:number=2757150158;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedLoad: (Reference<IfcStructuralLoad> | IfcStructuralLoad) , public GlobalOrLocal: IfcGlobalOrLocalEnum , public PredefinedType: IfcStructuralCurveActivityTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, AppliedLoad, GlobalOrLocal);
	}
}
export class IfcStructuralLinearAction extends IfcStructuralCurveAction {
	expressID:number=1807405624;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedLoad: (Reference<IfcStructuralLoad> | IfcStructuralLoad) , public GlobalOrLocal: IfcGlobalOrLocalEnum , public DestabilizingLoad: IfcBoolean | null, public ProjectedOrTrue: IfcProjectedOrTrueLengthEnum | null, public PredefinedType: IfcStructuralCurveActivityTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, AppliedLoad, GlobalOrLocal, DestabilizingLoad, ProjectedOrTrue, PredefinedType);
	}
}
export class IfcStructuralLoadGroup extends IfcGroup {
	expressID:number=1252848954;
	SourceOfResultGroup!: (Reference<IfcStructuralResultGroup> | IfcStructuralResultGroup)[] | null;
	LoadGroupFor!: (Reference<IfcStructuralAnalysisModel> | IfcStructuralAnalysisModel)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public PredefinedType: IfcLoadGroupTypeEnum , public ActionType: IfcActionTypeEnum , public ActionSource: IfcActionSourceTypeEnum , public Coefficient: IfcRatioMeasure | null, public Purpose: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcStructuralPointAction extends IfcStructuralAction {
	expressID:number=2082059205;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedLoad: (Reference<IfcStructuralLoad> | IfcStructuralLoad) , public GlobalOrLocal: IfcGlobalOrLocalEnum , public DestabilizingLoad: IfcBoolean | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, AppliedLoad, GlobalOrLocal, DestabilizingLoad);
	}
}
export class IfcStructuralPointConnection extends IfcStructuralConnection {
	expressID:number=734778138;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedCondition: (Reference<IfcBoundaryCondition> | IfcBoundaryCondition) | null, public ConditionCoordinateSystem: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, AppliedCondition);
	}
}
export class IfcStructuralPointReaction extends IfcStructuralReaction {
	expressID:number=1235345126;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedLoad: (Reference<IfcStructuralLoad> | IfcStructuralLoad) , public GlobalOrLocal: IfcGlobalOrLocalEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, AppliedLoad, GlobalOrLocal);
	}
}
export class IfcStructuralResultGroup extends IfcGroup {
	expressID:number=2986769608;
	ResultGroupFor!: (Reference<IfcStructuralAnalysisModel> | IfcStructuralAnalysisModel)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public TheoryType: IfcAnalysisTheoryTypeEnum , public ResultForLoadGroup: (Reference<IfcStructuralLoadGroup> | IfcStructuralLoadGroup) | null, public IsLinear: IfcBoolean )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcStructuralSurfaceAction extends IfcStructuralAction {
	expressID:number=3657597509;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedLoad: (Reference<IfcStructuralLoad> | IfcStructuralLoad) , public GlobalOrLocal: IfcGlobalOrLocalEnum , public DestabilizingLoad: IfcBoolean | null, public ProjectedOrTrue: IfcProjectedOrTrueLengthEnum | null, public PredefinedType: IfcStructuralSurfaceActivityTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, AppliedLoad, GlobalOrLocal, DestabilizingLoad);
	}
}
export class IfcStructuralSurfaceConnection extends IfcStructuralConnection {
	expressID:number=1975003073;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedCondition: (Reference<IfcBoundaryCondition> | IfcBoundaryCondition) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, AppliedCondition);
	}
}
export class IfcSubContractResource extends IfcConstructionResource {
	expressID:number=148013059;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identification: IfcIdentifier | null, public LongDescription: IfcText | null, public Usage: (Reference<IfcResourceTime> | IfcResourceTime) | null, public BaseCosts: (Reference<IfcAppliedValue> | IfcAppliedValue)[] | null, public BaseQuantity: (Reference<IfcPhysicalQuantity> | IfcPhysicalQuantity) | null, public PredefinedType: IfcSubContractResourceTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, Identification, LongDescription, Usage, BaseCosts, BaseQuantity);
	}
}
export class IfcSurfaceFeature extends IfcFeatureElement {
	expressID:number=3101698114;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcSurfaceFeatureTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcSwitchingDeviceType extends IfcFlowControllerType {
	expressID:number=2315554128;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcSwitchingDeviceTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcSystem extends IfcGroup {
	expressID:number=2254336722;
	ServicesBuildings!: (Reference<IfcRelServicesBuildings> | IfcRelServicesBuildings)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcSystemFurnitureElement extends IfcFurnishingElement {
	expressID:number=413509423;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcSystemFurnitureElementTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcTankType extends IfcFlowStorageDeviceType {
	expressID:number=5716631;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcTankTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcTendon extends IfcReinforcingElement {
	expressID:number=3824725483;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public SteelGrade: IfcLabel | null, public PredefinedType: IfcTendonTypeEnum | null, public NominalDiameter: IfcPositiveLengthMeasure | null, public CrossSectionArea: IfcAreaMeasure | null, public TensionForce: IfcForceMeasure | null, public PreStress: IfcPressureMeasure | null, public FrictionCoefficient: IfcNormalisedRatioMeasure | null, public AnchorageSlip: IfcPositiveLengthMeasure | null, public MinCurvatureRadius: IfcPositiveLengthMeasure | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag, SteelGrade);
	}
}
export class IfcTendonAnchor extends IfcReinforcingElement {
	expressID:number=2347447852;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public SteelGrade: IfcLabel | null, public PredefinedType: IfcTendonAnchorTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag, SteelGrade);
	}
}
export class IfcTendonAnchorType extends IfcReinforcingElementType {
	expressID:number=3081323446;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcTendonAnchorTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcTendonType extends IfcReinforcingElementType {
	expressID:number=2415094496;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcTendonTypeEnum , public NominalDiameter: IfcPositiveLengthMeasure | null, public CrossSectionArea: IfcAreaMeasure | null, public SheathDiameter: IfcPositiveLengthMeasure | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcTransformerType extends IfcEnergyConversionDeviceType {
	expressID:number=1692211062;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcTransformerTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcTransportElement extends IfcElement {
	expressID:number=1620046519;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcTransportElementTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcTrimmedCurve extends IfcBoundedCurve {
	expressID:number=3593883385;
	constructor(expressID: number, public BasisCurve: (Reference<IfcCurve> | IfcCurve) , public Trim1: IfcTrimmingSelect[] , public Trim2: IfcTrimmingSelect[] , public SenseAgreement: IfcBoolean , public MasterRepresentation: IfcTrimmingPreference )
	{
			super(expressID);
	}
}
export class IfcTubeBundleType extends IfcEnergyConversionDeviceType {
	expressID:number=1600972822;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcTubeBundleTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcUnitaryEquipmentType extends IfcEnergyConversionDeviceType {
	expressID:number=1911125066;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcUnitaryEquipmentTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcValveType extends IfcFlowControllerType {
	expressID:number=728799441;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcValveTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcVibrationIsolator extends IfcElementComponent {
	expressID:number=2391383451;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcVibrationIsolatorTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcVibrationIsolatorType extends IfcElementComponentType {
	expressID:number=3313531582;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcVibrationIsolatorTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcVirtualElement extends IfcElement {
	expressID:number=2769231204;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcVoidingFeature extends IfcFeatureElementSubtraction {
	expressID:number=926996030;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcVoidingFeatureTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcWallType extends IfcBuildingElementType {
	expressID:number=1898987631;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcWallTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcWasteTerminalType extends IfcFlowTerminalType {
	expressID:number=1133259667;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcWasteTerminalTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcWindowType extends IfcBuildingElementType {
	expressID:number=4009809668;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcWindowTypeEnum , public PartitioningType: IfcWindowTypePartitioningEnum , public ParameterTakesPrecedence: IfcBoolean | null, public UserDefinedPartitioningType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcWorkCalendar extends IfcControl {
	expressID:number=4088093105;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identification: IfcIdentifier | null, public WorkingTimes: (Reference<IfcWorkTime> | IfcWorkTime)[] | null, public ExceptionTimes: (Reference<IfcWorkTime> | IfcWorkTime)[] | null, public PredefinedType: IfcWorkCalendarTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, Identification);
	}
}
export class IfcWorkControl extends IfcControl {
	expressID:number=1028945134;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identification: IfcIdentifier | null, public CreationDate: IfcDateTime , public Creators: (Reference<IfcPerson> | IfcPerson)[] | null, public Purpose: IfcLabel | null, public Duration: IfcDuration | null, public TotalFloat: IfcDuration | null, public StartTime: IfcDateTime , public FinishTime: IfcDateTime | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, Identification);
	}
}
export class IfcWorkPlan extends IfcWorkControl {
	expressID:number=4218914973;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identification: IfcIdentifier | null, public CreationDate: IfcDateTime , public Creators: (Reference<IfcPerson> | IfcPerson)[] | null, public Purpose: IfcLabel | null, public Duration: IfcDuration | null, public TotalFloat: IfcDuration | null, public StartTime: IfcDateTime , public FinishTime: IfcDateTime | null, public PredefinedType: IfcWorkPlanTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, Identification, CreationDate, Creators, Purpose, Duration, TotalFloat, StartTime, FinishTime);
	}
}
export class IfcWorkSchedule extends IfcWorkControl {
	expressID:number=3342526732;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identification: IfcIdentifier | null, public CreationDate: IfcDateTime , public Creators: (Reference<IfcPerson> | IfcPerson)[] | null, public Purpose: IfcLabel | null, public Duration: IfcDuration | null, public TotalFloat: IfcDuration | null, public StartTime: IfcDateTime , public FinishTime: IfcDateTime | null, public PredefinedType: IfcWorkScheduleTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, Identification, CreationDate, Creators, Purpose, Duration, TotalFloat, StartTime, FinishTime);
	}
}
export class IfcZone extends IfcSystem {
	expressID:number=1033361043;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public LongName: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcActionRequest extends IfcControl {
	expressID:number=3821786052;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identification: IfcIdentifier | null, public PredefinedType: IfcActionRequestTypeEnum | null, public Status: IfcLabel | null, public LongDescription: IfcText | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, Identification);
	}
}
export class IfcAirTerminalBoxType extends IfcFlowControllerType {
	expressID:number=1411407467;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcAirTerminalBoxTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcAirTerminalType extends IfcFlowTerminalType {
	expressID:number=3352864051;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcAirTerminalTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcAirToAirHeatRecoveryType extends IfcEnergyConversionDeviceType {
	expressID:number=1871374353;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcAirToAirHeatRecoveryTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcAsset extends IfcGroup {
	expressID:number=3460190687;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identification: IfcIdentifier | null, public OriginalValue: (Reference<IfcCostValue> | IfcCostValue) | null, public CurrentValue: (Reference<IfcCostValue> | IfcCostValue) | null, public TotalReplacementCost: (Reference<IfcCostValue> | IfcCostValue) | null, public Owner: IfcActorSelect | null, public User: IfcActorSelect | null, public ResponsiblePerson: (Reference<IfcPerson> | IfcPerson) | null, public IncorporationDate: IfcDate | null, public DepreciatedValue: (Reference<IfcCostValue> | IfcCostValue) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcAudioVisualApplianceType extends IfcFlowTerminalType {
	expressID:number=1532957894;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcAudioVisualApplianceTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcBSplineCurve extends IfcBoundedCurve {
	expressID:number=1967976161;
	constructor(expressID: number, public Degree: IfcInteger , public ControlPointsList: (Reference<IfcCartesianPoint> | IfcCartesianPoint)[] , public CurveForm: IfcBSplineCurveForm , public ClosedCurve: IfcLogical , public SelfIntersect: IfcLogical )
	{
			super(expressID);
	}
}
export class IfcBSplineCurveWithKnots extends IfcBSplineCurve {
	expressID:number=2461110595;
	constructor(expressID: number, public Degree: IfcInteger , public ControlPointsList: (Reference<IfcCartesianPoint> | IfcCartesianPoint)[] , public CurveForm: IfcBSplineCurveForm , public ClosedCurve: IfcLogical , public SelfIntersect: IfcLogical , public KnotMultiplicities: IfcInteger[] , public Knots: IfcParameterValue[] , public KnotSpec: IfcKnotType )
	{
		super(expressID,Degree, ControlPointsList, CurveForm, ClosedCurve, SelfIntersect);
	}
}
export class IfcBeamType extends IfcBuildingElementType {
	expressID:number=819618141;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcBeamTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcBoilerType extends IfcEnergyConversionDeviceType {
	expressID:number=231477066;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcBoilerTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcBoundaryCurve extends IfcCompositeCurveOnSurface {
	expressID:number=1136057603;
	constructor(expressID: number, public Segments: (Reference<IfcCompositeCurveSegment> | IfcCompositeCurveSegment)[] , public SelfIntersect: IfcLogical )
	{
		super(expressID,Segments, SelfIntersect);
	}
}
export class IfcBuildingElement extends IfcElement {
	expressID:number=3299480353;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcBuildingElementPart extends IfcElementComponent {
	expressID:number=2979338954;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcBuildingElementPartTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcBuildingElementPartType extends IfcElementComponentType {
	expressID:number=39481116;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcBuildingElementPartTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcBuildingElementProxy extends IfcBuildingElement {
	expressID:number=1095909175;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcBuildingElementProxyTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcBuildingElementProxyType extends IfcBuildingElementType {
	expressID:number=1909888760;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcBuildingElementProxyTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcBuildingSystem extends IfcSystem {
	expressID:number=1177604601;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public PredefinedType: IfcBuildingSystemTypeEnum | null, public LongName: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcBurnerType extends IfcEnergyConversionDeviceType {
	expressID:number=2188180465;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcBurnerTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcCableCarrierFittingType extends IfcFlowFittingType {
	expressID:number=395041908;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcCableCarrierFittingTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcCableCarrierSegmentType extends IfcFlowSegmentType {
	expressID:number=3293546465;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcCableCarrierSegmentTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcCableFittingType extends IfcFlowFittingType {
	expressID:number=2674252688;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcCableFittingTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcCableSegmentType extends IfcFlowSegmentType {
	expressID:number=1285652485;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcCableSegmentTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcChillerType extends IfcEnergyConversionDeviceType {
	expressID:number=2951183804;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcChillerTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcChimney extends IfcBuildingElement {
	expressID:number=3296154744;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcChimneyTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcCircle extends IfcConic {
	expressID:number=2611217952;
	constructor(expressID: number, public Position: IfcAxis2Placement , public Radius: IfcPositiveLengthMeasure )
	{
		super(expressID,Position);
	}
}
export class IfcCivilElement extends IfcElement {
	expressID:number=1677625105;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcCoilType extends IfcEnergyConversionDeviceType {
	expressID:number=2301859152;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcCoilTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcColumn extends IfcBuildingElement {
	expressID:number=843113511;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcColumnTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcColumnStandardCase extends IfcColumn {
	expressID:number=905975707;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcColumnTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag, PredefinedType);
	}
}
export class IfcCommunicationsApplianceType extends IfcFlowTerminalType {
	expressID:number=400855858;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcCommunicationsApplianceTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcCompressorType extends IfcFlowMovingDeviceType {
	expressID:number=3850581409;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcCompressorTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcCondenserType extends IfcEnergyConversionDeviceType {
	expressID:number=2816379211;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcCondenserTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcConstructionEquipmentResource extends IfcConstructionResource {
	expressID:number=3898045240;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identification: IfcIdentifier | null, public LongDescription: IfcText | null, public Usage: (Reference<IfcResourceTime> | IfcResourceTime) | null, public BaseCosts: (Reference<IfcAppliedValue> | IfcAppliedValue)[] | null, public BaseQuantity: (Reference<IfcPhysicalQuantity> | IfcPhysicalQuantity) | null, public PredefinedType: IfcConstructionEquipmentResourceTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, Identification, LongDescription, Usage, BaseCosts, BaseQuantity);
	}
}
export class IfcConstructionMaterialResource extends IfcConstructionResource {
	expressID:number=1060000209;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identification: IfcIdentifier | null, public LongDescription: IfcText | null, public Usage: (Reference<IfcResourceTime> | IfcResourceTime) | null, public BaseCosts: (Reference<IfcAppliedValue> | IfcAppliedValue)[] | null, public BaseQuantity: (Reference<IfcPhysicalQuantity> | IfcPhysicalQuantity) | null, public PredefinedType: IfcConstructionMaterialResourceTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, Identification, LongDescription, Usage, BaseCosts, BaseQuantity);
	}
}
export class IfcConstructionProductResource extends IfcConstructionResource {
	expressID:number=488727124;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public Identification: IfcIdentifier | null, public LongDescription: IfcText | null, public Usage: (Reference<IfcResourceTime> | IfcResourceTime) | null, public BaseCosts: (Reference<IfcAppliedValue> | IfcAppliedValue)[] | null, public BaseQuantity: (Reference<IfcPhysicalQuantity> | IfcPhysicalQuantity) | null, public PredefinedType: IfcConstructionProductResourceTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, Identification, LongDescription, Usage, BaseCosts, BaseQuantity);
	}
}
export class IfcCooledBeamType extends IfcEnergyConversionDeviceType {
	expressID:number=335055490;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcCooledBeamTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcCoolingTowerType extends IfcEnergyConversionDeviceType {
	expressID:number=2954562838;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcCoolingTowerTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcCovering extends IfcBuildingElement {
	expressID:number=1973544240;
	CoversSpaces!: (Reference<IfcRelCoversSpaces> | IfcRelCoversSpaces)[] | null;
	CoversElements!: (Reference<IfcRelCoversBldgElements> | IfcRelCoversBldgElements)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcCoveringTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcCurtainWall extends IfcBuildingElement {
	expressID:number=3495092785;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcCurtainWallTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcDamperType extends IfcFlowControllerType {
	expressID:number=3961806047;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcDamperTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcDiscreteAccessory extends IfcElementComponent {
	expressID:number=1335981549;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcDiscreteAccessoryTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcDiscreteAccessoryType extends IfcElementComponentType {
	expressID:number=2635815018;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcDiscreteAccessoryTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcDistributionChamberElementType extends IfcDistributionFlowElementType {
	expressID:number=1599208980;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcDistributionChamberElementTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcDistributionControlElementType extends IfcDistributionElementType {
	expressID:number=2063403501;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcDistributionElement extends IfcElement {
	expressID:number=1945004755;
	HasPorts!: (Reference<IfcRelConnectsPortToElement> | IfcRelConnectsPortToElement)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcDistributionFlowElement extends IfcDistributionElement {
	expressID:number=3040386961;
	HasControlElements!: (Reference<IfcRelFlowControlElements> | IfcRelFlowControlElements)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcDistributionPort extends IfcPort {
	expressID:number=3041715199;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public FlowDirection: IfcFlowDirectionEnum | null, public PredefinedType: IfcDistributionPortTypeEnum | null, public SystemType: IfcDistributionSystemEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcDistributionSystem extends IfcSystem {
	expressID:number=3205830791;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public LongName: IfcLabel | null, public PredefinedType: IfcDistributionSystemEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcDoor extends IfcBuildingElement {
	expressID:number=395920057;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public OverallHeight: IfcPositiveLengthMeasure | null, public OverallWidth: IfcPositiveLengthMeasure | null, public PredefinedType: IfcDoorTypeEnum | null, public OperationType: IfcDoorTypeOperationEnum | null, public UserDefinedOperationType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcDoorStandardCase extends IfcDoor {
	expressID:number=3242481149;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public OverallHeight: IfcPositiveLengthMeasure | null, public OverallWidth: IfcPositiveLengthMeasure | null, public PredefinedType: IfcDoorTypeEnum | null, public OperationType: IfcDoorTypeOperationEnum | null, public UserDefinedOperationType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag, OverallHeight, OverallWidth, PredefinedType, OperationType, UserDefinedOperationType);
	}
}
export class IfcDuctFittingType extends IfcFlowFittingType {
	expressID:number=869906466;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcDuctFittingTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcDuctSegmentType extends IfcFlowSegmentType {
	expressID:number=3760055223;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcDuctSegmentTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcDuctSilencerType extends IfcFlowTreatmentDeviceType {
	expressID:number=2030761528;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcDuctSilencerTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcElectricApplianceType extends IfcFlowTerminalType {
	expressID:number=663422040;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcElectricApplianceTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcElectricDistributionBoardType extends IfcFlowControllerType {
	expressID:number=2417008758;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcElectricDistributionBoardTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcElectricFlowStorageDeviceType extends IfcFlowStorageDeviceType {
	expressID:number=3277789161;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcElectricFlowStorageDeviceTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcElectricGeneratorType extends IfcEnergyConversionDeviceType {
	expressID:number=1534661035;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcElectricGeneratorTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcElectricMotorType extends IfcEnergyConversionDeviceType {
	expressID:number=1217240411;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcElectricMotorTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcElectricTimeControlType extends IfcFlowControllerType {
	expressID:number=712377611;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcElectricTimeControlTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcEnergyConversionDevice extends IfcDistributionFlowElement {
	expressID:number=1658829314;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcEngine extends IfcEnergyConversionDevice {
	expressID:number=2814081492;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcEngineTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcEvaporativeCooler extends IfcEnergyConversionDevice {
	expressID:number=3747195512;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcEvaporativeCoolerTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcEvaporator extends IfcEnergyConversionDevice {
	expressID:number=484807127;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcEvaporatorTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcExternalSpatialElement extends IfcExternalSpatialStructureElement {
	expressID:number=1209101575;
	BoundedBy!: (Reference<IfcRelSpaceBoundary> | IfcRelSpaceBoundary)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public PredefinedType: IfcExternalSpatialElementTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName);
	}
}
export class IfcFanType extends IfcFlowMovingDeviceType {
	expressID:number=346874300;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcFanTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFilterType extends IfcFlowTreatmentDeviceType {
	expressID:number=1810631287;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcFilterTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFireSuppressionTerminalType extends IfcFlowTerminalType {
	expressID:number=4222183408;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcFireSuppressionTerminalTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFlowController extends IfcDistributionFlowElement {
	expressID:number=2058353004;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFlowFitting extends IfcDistributionFlowElement {
	expressID:number=4278956645;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFlowInstrumentType extends IfcDistributionControlElementType {
	expressID:number=4037862832;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcFlowInstrumentTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcFlowMeter extends IfcFlowController {
	expressID:number=2188021234;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcFlowMeterTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFlowMovingDevice extends IfcDistributionFlowElement {
	expressID:number=3132237377;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFlowSegment extends IfcDistributionFlowElement {
	expressID:number=987401354;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFlowStorageDevice extends IfcDistributionFlowElement {
	expressID:number=707683696;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFlowTerminal extends IfcDistributionFlowElement {
	expressID:number=2223149337;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFlowTreatmentDevice extends IfcDistributionFlowElement {
	expressID:number=3508470533;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFooting extends IfcBuildingElement {
	expressID:number=900683007;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcFootingTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcHeatExchanger extends IfcEnergyConversionDevice {
	expressID:number=3319311131;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcHeatExchangerTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcHumidifier extends IfcEnergyConversionDevice {
	expressID:number=2068733104;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcHumidifierTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcInterceptor extends IfcFlowTreatmentDevice {
	expressID:number=4175244083;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcInterceptorTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcJunctionBox extends IfcFlowFitting {
	expressID:number=2176052936;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcJunctionBoxTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcLamp extends IfcFlowTerminal {
	expressID:number=76236018;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcLampTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcLightFixture extends IfcFlowTerminal {
	expressID:number=629592764;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcLightFixtureTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcMedicalDevice extends IfcFlowTerminal {
	expressID:number=1437502449;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcMedicalDeviceTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcMember extends IfcBuildingElement {
	expressID:number=1073191201;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcMemberTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcMemberStandardCase extends IfcMember {
	expressID:number=1911478936;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcMemberTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag, PredefinedType);
	}
}
export class IfcMotorConnection extends IfcEnergyConversionDevice {
	expressID:number=2474470126;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcMotorConnectionTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcOuterBoundaryCurve extends IfcBoundaryCurve {
	expressID:number=144952367;
	constructor(expressID: number, public Segments: (Reference<IfcCompositeCurveSegment> | IfcCompositeCurveSegment)[] , public SelfIntersect: IfcLogical )
	{
		super(expressID,Segments, SelfIntersect);
	}
}
export class IfcOutlet extends IfcFlowTerminal {
	expressID:number=3694346114;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcOutletTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcPile extends IfcBuildingElement {
	expressID:number=1687234759;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcPileTypeEnum | null, public ConstructionType: IfcPileConstructionEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcPipeFitting extends IfcFlowFitting {
	expressID:number=310824031;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcPipeFittingTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcPipeSegment extends IfcFlowSegment {
	expressID:number=3612865200;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcPipeSegmentTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcPlate extends IfcBuildingElement {
	expressID:number=3171933400;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcPlateTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcPlateStandardCase extends IfcPlate {
	expressID:number=1156407060;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcPlateTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag, PredefinedType);
	}
}
export class IfcProtectiveDevice extends IfcFlowController {
	expressID:number=738039164;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcProtectiveDeviceTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcProtectiveDeviceTrippingUnitType extends IfcDistributionControlElementType {
	expressID:number=655969474;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcProtectiveDeviceTrippingUnitTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcPump extends IfcFlowMovingDevice {
	expressID:number=90941305;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcPumpTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcRailing extends IfcBuildingElement {
	expressID:number=2262370178;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcRailingTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcRamp extends IfcBuildingElement {
	expressID:number=3024970846;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcRampTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcRampFlight extends IfcBuildingElement {
	expressID:number=3283111854;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcRampFlightTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcRationalBSplineCurveWithKnots extends IfcBSplineCurveWithKnots {
	expressID:number=1232101972;
	constructor(expressID: number, public Degree: IfcInteger , public ControlPointsList: (Reference<IfcCartesianPoint> | IfcCartesianPoint)[] , public CurveForm: IfcBSplineCurveForm , public ClosedCurve: IfcLogical , public SelfIntersect: IfcLogical , public KnotMultiplicities: IfcInteger[] , public Knots: IfcParameterValue[] , public KnotSpec: IfcKnotType , public WeightsData: IfcReal[] )
	{
		super(expressID,Degree, ControlPointsList, CurveForm, ClosedCurve, SelfIntersect, KnotMultiplicities, Knots, KnotSpec);
	}
}
export class IfcReinforcingBar extends IfcReinforcingElement {
	expressID:number=979691226;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public SteelGrade: IfcLabel | null, public NominalDiameter: IfcPositiveLengthMeasure | null, public CrossSectionArea: IfcAreaMeasure | null, public BarLength: IfcPositiveLengthMeasure | null, public PredefinedType: IfcReinforcingBarTypeEnum | null, public BarSurface: IfcReinforcingBarSurfaceEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag, SteelGrade);
	}
}
export class IfcReinforcingBarType extends IfcReinforcingElementType {
	expressID:number=2572171363;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcReinforcingBarTypeEnum , public NominalDiameter: IfcPositiveLengthMeasure | null, public CrossSectionArea: IfcAreaMeasure | null, public BarLength: IfcPositiveLengthMeasure | null, public BarSurface: IfcReinforcingBarSurfaceEnum | null, public BendingShapeCode: IfcLabel | null, public BendingParameters: IfcBendingParameterSelect[] | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcRoof extends IfcBuildingElement {
	expressID:number=2016517767;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcRoofTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcSanitaryTerminal extends IfcFlowTerminal {
	expressID:number=3053780830;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcSanitaryTerminalTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcSensorType extends IfcDistributionControlElementType {
	expressID:number=1783015770;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcSensorTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcShadingDevice extends IfcBuildingElement {
	expressID:number=1329646415;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcShadingDeviceTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcSlab extends IfcBuildingElement {
	expressID:number=1529196076;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcSlabTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcSlabElementedCase extends IfcSlab {
	expressID:number=3127900445;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcSlabTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag, PredefinedType);
	}
}
export class IfcSlabStandardCase extends IfcSlab {
	expressID:number=3027962421;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcSlabTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag, PredefinedType);
	}
}
export class IfcSolarDevice extends IfcEnergyConversionDevice {
	expressID:number=3420628829;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcSolarDeviceTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcSpaceHeater extends IfcFlowTerminal {
	expressID:number=1999602285;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcSpaceHeaterTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcStackTerminal extends IfcFlowTerminal {
	expressID:number=1404847402;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcStackTerminalTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcStair extends IfcBuildingElement {
	expressID:number=331165859;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcStairTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcStairFlight extends IfcBuildingElement {
	expressID:number=4252922144;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public NumberOfRisers: IfcInteger | null, public NumberOfTreads: IfcInteger | null, public RiserHeight: IfcPositiveLengthMeasure | null, public TreadLength: IfcPositiveLengthMeasure | null, public PredefinedType: IfcStairFlightTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcStructuralAnalysisModel extends IfcSystem {
	expressID:number=2515109513;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public PredefinedType: IfcAnalysisModelTypeEnum , public OrientationOf2DPlane: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) | null, public LoadedBy: (Reference<IfcStructuralLoadGroup> | IfcStructuralLoadGroup)[] | null, public HasResults: (Reference<IfcStructuralResultGroup> | IfcStructuralResultGroup)[] | null, public SharedPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType);
	}
}
export class IfcStructuralLoadCase extends IfcStructuralLoadGroup {
	expressID:number=385403989;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public PredefinedType: IfcLoadGroupTypeEnum , public ActionType: IfcActionTypeEnum , public ActionSource: IfcActionSourceTypeEnum , public Coefficient: IfcRatioMeasure | null, public Purpose: IfcLabel | null, public SelfWeightCoefficients: IfcRatioMeasure[] | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, PredefinedType, ActionType, ActionSource, Coefficient, Purpose);
	}
}
export class IfcStructuralPlanarAction extends IfcStructuralSurfaceAction {
	expressID:number=1621171031;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedLoad: (Reference<IfcStructuralLoad> | IfcStructuralLoad) , public GlobalOrLocal: IfcGlobalOrLocalEnum , public DestabilizingLoad: IfcBoolean | null, public ProjectedOrTrue: IfcProjectedOrTrueLengthEnum | null, public PredefinedType: IfcStructuralSurfaceActivityTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, AppliedLoad, GlobalOrLocal, DestabilizingLoad, ProjectedOrTrue, PredefinedType);
	}
}
export class IfcSwitchingDevice extends IfcFlowController {
	expressID:number=1162798199;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcSwitchingDeviceTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcTank extends IfcFlowStorageDevice {
	expressID:number=812556717;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcTankTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcTransformer extends IfcEnergyConversionDevice {
	expressID:number=3825984169;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcTransformerTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcTubeBundle extends IfcEnergyConversionDevice {
	expressID:number=3026737570;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcTubeBundleTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcUnitaryControlElementType extends IfcDistributionControlElementType {
	expressID:number=3179687236;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcUnitaryControlElementTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcUnitaryEquipment extends IfcEnergyConversionDevice {
	expressID:number=4292641817;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcUnitaryEquipmentTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcValve extends IfcFlowController {
	expressID:number=4207607924;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcValveTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcWall extends IfcBuildingElement {
	expressID:number=2391406946;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcWallTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcWallElementedCase extends IfcWall {
	expressID:number=4156078855;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcWallTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag, PredefinedType);
	}
}
export class IfcWallStandardCase extends IfcWall {
	expressID:number=3512223829;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcWallTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag, PredefinedType);
	}
}
export class IfcWasteTerminal extends IfcFlowTerminal {
	expressID:number=4237592921;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcWasteTerminalTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcWindow extends IfcBuildingElement {
	expressID:number=3304561284;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public OverallHeight: IfcPositiveLengthMeasure | null, public OverallWidth: IfcPositiveLengthMeasure | null, public PredefinedType: IfcWindowTypeEnum | null, public PartitioningType: IfcWindowTypePartitioningEnum | null, public UserDefinedPartitioningType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcWindowStandardCase extends IfcWindow {
	expressID:number=486154966;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public OverallHeight: IfcPositiveLengthMeasure | null, public OverallWidth: IfcPositiveLengthMeasure | null, public PredefinedType: IfcWindowTypeEnum | null, public PartitioningType: IfcWindowTypePartitioningEnum | null, public UserDefinedPartitioningType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag, OverallHeight, OverallWidth, PredefinedType, PartitioningType, UserDefinedPartitioningType);
	}
}
export class IfcActuatorType extends IfcDistributionControlElementType {
	expressID:number=2874132201;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcActuatorTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcAirTerminal extends IfcFlowTerminal {
	expressID:number=1634111441;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcAirTerminalTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcAirTerminalBox extends IfcFlowController {
	expressID:number=177149247;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcAirTerminalBoxTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcAirToAirHeatRecovery extends IfcEnergyConversionDevice {
	expressID:number=2056796094;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcAirToAirHeatRecoveryTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcAlarmType extends IfcDistributionControlElementType {
	expressID:number=3001207471;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcAlarmTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcAudioVisualAppliance extends IfcFlowTerminal {
	expressID:number=277319702;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcAudioVisualApplianceTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcBeam extends IfcBuildingElement {
	expressID:number=753842376;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcBeamTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcBeamStandardCase extends IfcBeam {
	expressID:number=2906023776;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcBeamTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag, PredefinedType);
	}
}
export class IfcBoiler extends IfcEnergyConversionDevice {
	expressID:number=32344328;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcBoilerTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcBurner extends IfcEnergyConversionDevice {
	expressID:number=2938176219;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcBurnerTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcCableCarrierFitting extends IfcFlowFitting {
	expressID:number=635142910;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcCableCarrierFittingTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcCableCarrierSegment extends IfcFlowSegment {
	expressID:number=3758799889;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcCableCarrierSegmentTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcCableFitting extends IfcFlowFitting {
	expressID:number=1051757585;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcCableFittingTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcCableSegment extends IfcFlowSegment {
	expressID:number=4217484030;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcCableSegmentTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcChiller extends IfcEnergyConversionDevice {
	expressID:number=3902619387;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcChillerTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcCoil extends IfcEnergyConversionDevice {
	expressID:number=639361253;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcCoilTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcCommunicationsAppliance extends IfcFlowTerminal {
	expressID:number=3221913625;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcCommunicationsApplianceTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcCompressor extends IfcFlowMovingDevice {
	expressID:number=3571504051;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcCompressorTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcCondenser extends IfcEnergyConversionDevice {
	expressID:number=2272882330;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcCondenserTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcControllerType extends IfcDistributionControlElementType {
	expressID:number=578613899;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcControllerTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcCooledBeam extends IfcEnergyConversionDevice {
	expressID:number=4136498852;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcCooledBeamTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcCoolingTower extends IfcEnergyConversionDevice {
	expressID:number=3640358203;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcCoolingTowerTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcDamper extends IfcFlowController {
	expressID:number=4074379575;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcDamperTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcDistributionChamberElement extends IfcDistributionFlowElement {
	expressID:number=1052013943;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcDistributionChamberElementTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcDistributionCircuit extends IfcDistributionSystem {
	expressID:number=562808652;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public LongName: IfcLabel | null, public PredefinedType: IfcDistributionSystemEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, LongName, PredefinedType);
	}
}
export class IfcDistributionControlElement extends IfcDistributionElement {
	expressID:number=1062813311;
	AssignedToFlowElement!: (Reference<IfcRelFlowControlElements> | IfcRelFlowControlElements)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcDuctFitting extends IfcFlowFitting {
	expressID:number=342316401;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcDuctFittingTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcDuctSegment extends IfcFlowSegment {
	expressID:number=3518393246;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcDuctSegmentTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcDuctSilencer extends IfcFlowTreatmentDevice {
	expressID:number=1360408905;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcDuctSilencerTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcElectricAppliance extends IfcFlowTerminal {
	expressID:number=1904799276;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcElectricApplianceTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcElectricDistributionBoard extends IfcFlowController {
	expressID:number=862014818;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcElectricDistributionBoardTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcElectricFlowStorageDevice extends IfcFlowStorageDevice {
	expressID:number=3310460725;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcElectricFlowStorageDeviceTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcElectricGenerator extends IfcEnergyConversionDevice {
	expressID:number=264262732;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcElectricGeneratorTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcElectricMotor extends IfcEnergyConversionDevice {
	expressID:number=402227799;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcElectricMotorTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcElectricTimeControl extends IfcFlowController {
	expressID:number=1003880860;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcElectricTimeControlTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFan extends IfcFlowMovingDevice {
	expressID:number=3415622556;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcFanTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFilter extends IfcFlowTreatmentDevice {
	expressID:number=819412036;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcFilterTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFireSuppressionTerminal extends IfcFlowTerminal {
	expressID:number=1426591983;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcFireSuppressionTerminalTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcFlowInstrument extends IfcDistributionControlElement {
	expressID:number=182646315;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcFlowInstrumentTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcProtectiveDeviceTrippingUnit extends IfcDistributionControlElement {
	expressID:number=2295281155;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcProtectiveDeviceTrippingUnitTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcSensor extends IfcDistributionControlElement {
	expressID:number=4086658281;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcSensorTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcUnitaryControlElement extends IfcDistributionControlElement {
	expressID:number=630975310;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcUnitaryControlElementTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcActuator extends IfcDistributionControlElement {
	expressID:number=4288193352;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcActuatorTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcAlarm extends IfcDistributionControlElement {
	expressID:number=3087945054;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcAlarmTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcController extends IfcDistributionControlElement {
	expressID:number=25142252;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcControllerTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}