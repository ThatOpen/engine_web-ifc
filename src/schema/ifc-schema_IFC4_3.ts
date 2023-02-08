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
	static BRAKES : any =  { type:3, value:'BRAKES'}; static BUOYANCY : any =  { type:3, value:'BUOYANCY'}; static COMPLETION_G1 : any =  { type:3, value:'COMPLETION_G1'}; static CREEP : any =  { type:3, value:'CREEP'}; static CURRENT : any =  { type:3, value:'CURRENT'}; static DEAD_LOAD_G : any =  { type:3, value:'DEAD_LOAD_G'}; static EARTHQUAKE_E : any =  { type:3, value:'EARTHQUAKE_E'}; static ERECTION : any =  { type:3, value:'ERECTION'}; static FIRE : any =  { type:3, value:'FIRE'}; static ICE : any =  { type:3, value:'ICE'}; static IMPACT : any =  { type:3, value:'IMPACT'}; static IMPULSE : any =  { type:3, value:'IMPULSE'}; static LACK_OF_FIT : any =  { type:3, value:'LACK_OF_FIT'}; static LIVE_LOAD_Q : any =  { type:3, value:'LIVE_LOAD_Q'}; static PRESTRESSING_P : any =  { type:3, value:'PRESTRESSING_P'}; static PROPPING : any =  { type:3, value:'PROPPING'}; static RAIN : any =  { type:3, value:'RAIN'}; static SETTLEMENT_U : any =  { type:3, value:'SETTLEMENT_U'}; static SHRINKAGE : any =  { type:3, value:'SHRINKAGE'}; static SNOW_S : any =  { type:3, value:'SNOW_S'}; static SYSTEM_IMPERFECTION : any =  { type:3, value:'SYSTEM_IMPERFECTION'}; static TEMPERATURE_T : any =  { type:3, value:'TEMPERATURE_T'}; static TRANSPORT : any =  { type:3, value:'TRANSPORT'}; static WAVE : any =  { type:3, value:'WAVE'}; static WIND_W : any =  { type:3, value:'WIND_W'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcActionTypeEnum {
	static EXTRAORDINARY_A : any =  { type:3, value:'EXTRAORDINARY_A'}; static PERMANENT_G : any =  { type:3, value:'PERMANENT_G'}; static VARIABLE_Q : any =  { type:3, value:'VARIABLE_Q'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcActuatorTypeEnum {
	static ELECTRICACTUATOR : any =  { type:3, value:'ELECTRICACTUATOR'}; static HANDOPERATEDACTUATOR : any =  { type:3, value:'HANDOPERATEDACTUATOR'}; static HYDRAULICACTUATOR : any =  { type:3, value:'HYDRAULICACTUATOR'}; static PNEUMATICACTUATOR : any =  { type:3, value:'PNEUMATICACTUATOR'}; static THERMOSTATICACTUATOR : any =  { type:3, value:'THERMOSTATICACTUATOR'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcAddressTypeEnum {
	static DISTRIBUTIONPOINT : any =  { type:3, value:'DISTRIBUTIONPOINT'}; static HOME : any =  { type:3, value:'HOME'}; static OFFICE : any =  { type:3, value:'OFFICE'}; static SITE : any =  { type:3, value:'SITE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; 
}
export class IfcAirTerminalBoxTypeEnum {
	static CONSTANTFLOW : any =  { type:3, value:'CONSTANTFLOW'}; static VARIABLEFLOWPRESSUREDEPENDANT : any =  { type:3, value:'VARIABLEFLOWPRESSUREDEPENDANT'}; static VARIABLEFLOWPRESSUREINDEPENDANT : any =  { type:3, value:'VARIABLEFLOWPRESSUREINDEPENDANT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcAirTerminalTypeEnum {
	static DIFFUSER : any =  { type:3, value:'DIFFUSER'}; static GRILLE : any =  { type:3, value:'GRILLE'}; static LOUVRE : any =  { type:3, value:'LOUVRE'}; static REGISTER : any =  { type:3, value:'REGISTER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcAirToAirHeatRecoveryTypeEnum {
	static FIXEDPLATECOUNTERFLOWEXCHANGER : any =  { type:3, value:'FIXEDPLATECOUNTERFLOWEXCHANGER'}; static FIXEDPLATECROSSFLOWEXCHANGER : any =  { type:3, value:'FIXEDPLATECROSSFLOWEXCHANGER'}; static FIXEDPLATEPARALLELFLOWEXCHANGER : any =  { type:3, value:'FIXEDPLATEPARALLELFLOWEXCHANGER'}; static HEATPIPE : any =  { type:3, value:'HEATPIPE'}; static ROTARYWHEEL : any =  { type:3, value:'ROTARYWHEEL'}; static RUNAROUNDCOILLOOP : any =  { type:3, value:'RUNAROUNDCOILLOOP'}; static THERMOSIPHONCOILTYPEHEATEXCHANGERS : any =  { type:3, value:'THERMOSIPHONCOILTYPEHEATEXCHANGERS'}; static THERMOSIPHONSEALEDTUBEHEATEXCHANGERS : any =  { type:3, value:'THERMOSIPHONSEALEDTUBEHEATEXCHANGERS'}; static TWINTOWERENTHALPYRECOVERYLOOPS : any =  { type:3, value:'TWINTOWERENTHALPYRECOVERYLOOPS'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcAlarmTypeEnum {
	static BELL : any =  { type:3, value:'BELL'}; static BREAKGLASSBUTTON : any =  { type:3, value:'BREAKGLASSBUTTON'}; static LIGHT : any =  { type:3, value:'LIGHT'}; static MANUALPULLBOX : any =  { type:3, value:'MANUALPULLBOX'}; static RAILWAYCROCODILE : any =  { type:3, value:'RAILWAYCROCODILE'}; static RAILWAYDETONATOR : any =  { type:3, value:'RAILWAYDETONATOR'}; static SIREN : any =  { type:3, value:'SIREN'}; static WHISTLE : any =  { type:3, value:'WHISTLE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcAlignmentCantSegmentTypeEnum {
	static BLOSSCURVE : any =  { type:3, value:'BLOSSCURVE'}; static CONSTANTCANT : any =  { type:3, value:'CONSTANTCANT'}; static COSINECURVE : any =  { type:3, value:'COSINECURVE'}; static HELMERTCURVE : any =  { type:3, value:'HELMERTCURVE'}; static LINEARTRANSITION : any =  { type:3, value:'LINEARTRANSITION'}; static SINECURVE : any =  { type:3, value:'SINECURVE'}; static VIENNESEBEND : any =  { type:3, value:'VIENNESEBEND'}; 
}
export class IfcAlignmentHorizontalSegmentTypeEnum {
	static BLOSSCURVE : any =  { type:3, value:'BLOSSCURVE'}; static CIRCULARARC : any =  { type:3, value:'CIRCULARARC'}; static CLOTHOID : any =  { type:3, value:'CLOTHOID'}; static COSINECURVE : any =  { type:3, value:'COSINECURVE'}; static CUBIC : any =  { type:3, value:'CUBIC'}; static HELMERTCURVE : any =  { type:3, value:'HELMERTCURVE'}; static LINE : any =  { type:3, value:'LINE'}; static SINECURVE : any =  { type:3, value:'SINECURVE'}; static VIENNESEBEND : any =  { type:3, value:'VIENNESEBEND'}; 
}
export class IfcAlignmentTypeEnum {
	static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcAlignmentVerticalSegmentTypeEnum {
	static CIRCULARARC : any =  { type:3, value:'CIRCULARARC'}; static CLOTHOID : any =  { type:3, value:'CLOTHOID'}; static CONSTANTGRADIENT : any =  { type:3, value:'CONSTANTGRADIENT'}; static PARABOLICARC : any =  { type:3, value:'PARABOLICARC'}; 
}
export class IfcAnalysisModelTypeEnum {
	static IN_PLANE_LOADING_2D : any =  { type:3, value:'IN_PLANE_LOADING_2D'}; static LOADING_3D : any =  { type:3, value:'LOADING_3D'}; static OUT_PLANE_LOADING_2D : any =  { type:3, value:'OUT_PLANE_LOADING_2D'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcAnalysisTheoryTypeEnum {
	static FIRST_ORDER_THEORY : any =  { type:3, value:'FIRST_ORDER_THEORY'}; static FULL_NONLINEAR_THEORY : any =  { type:3, value:'FULL_NONLINEAR_THEORY'}; static SECOND_ORDER_THEORY : any =  { type:3, value:'SECOND_ORDER_THEORY'}; static THIRD_ORDER_THEORY : any =  { type:3, value:'THIRD_ORDER_THEORY'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcAnnotationTypeEnum {
	static ASBUILTAREA : any =  { type:3, value:'ASBUILTAREA'}; static ASBUILTLINE : any =  { type:3, value:'ASBUILTLINE'}; static ASBUILTPOINT : any =  { type:3, value:'ASBUILTPOINT'}; static ASSUMEDAREA : any =  { type:3, value:'ASSUMEDAREA'}; static ASSUMEDLINE : any =  { type:3, value:'ASSUMEDLINE'}; static ASSUMEDPOINT : any =  { type:3, value:'ASSUMEDPOINT'}; static NON_PHYSICAL_SIGNAL : any =  { type:3, value:'NON_PHYSICAL_SIGNAL'}; static SUPERELEVATIONEVENT : any =  { type:3, value:'SUPERELEVATIONEVENT'}; static WIDTHEVENT : any =  { type:3, value:'WIDTHEVENT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcArithmeticOperatorEnum {
	static ADD : any =  { type:3, value:'ADD'}; static DIVIDE : any =  { type:3, value:'DIVIDE'}; static MULTIPLY : any =  { type:3, value:'MULTIPLY'}; static SUBTRACT : any =  { type:3, value:'SUBTRACT'}; 
}
export class IfcAssemblyPlaceEnum {
	static FACTORY : any =  { type:3, value:'FACTORY'}; static SITE : any =  { type:3, value:'SITE'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcAudioVisualApplianceTypeEnum {
	static AMPLIFIER : any =  { type:3, value:'AMPLIFIER'}; static CAMERA : any =  { type:3, value:'CAMERA'}; static COMMUNICATIONTERMINAL : any =  { type:3, value:'COMMUNICATIONTERMINAL'}; static DISPLAY : any =  { type:3, value:'DISPLAY'}; static MICROPHONE : any =  { type:3, value:'MICROPHONE'}; static PLAYER : any =  { type:3, value:'PLAYER'}; static PROJECTOR : any =  { type:3, value:'PROJECTOR'}; static RECEIVER : any =  { type:3, value:'RECEIVER'}; static RECORDINGEQUIPMENT : any =  { type:3, value:'RECORDINGEQUIPMENT'}; static SPEAKER : any =  { type:3, value:'SPEAKER'}; static SWITCHER : any =  { type:3, value:'SWITCHER'}; static TELEPHONE : any =  { type:3, value:'TELEPHONE'}; static TUNER : any =  { type:3, value:'TUNER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcBSplineCurveForm {
	static CIRCULAR_ARC : any =  { type:3, value:'CIRCULAR_ARC'}; static ELLIPTIC_ARC : any =  { type:3, value:'ELLIPTIC_ARC'}; static HYPERBOLIC_ARC : any =  { type:3, value:'HYPERBOLIC_ARC'}; static PARABOLIC_ARC : any =  { type:3, value:'PARABOLIC_ARC'}; static POLYLINE_FORM : any =  { type:3, value:'POLYLINE_FORM'}; static UNSPECIFIED : any =  { type:3, value:'UNSPECIFIED'}; 
}
export class IfcBSplineSurfaceForm {
	static CONICAL_SURF : any =  { type:3, value:'CONICAL_SURF'}; static CYLINDRICAL_SURF : any =  { type:3, value:'CYLINDRICAL_SURF'}; static GENERALISED_CONE : any =  { type:3, value:'GENERALISED_CONE'}; static PLANE_SURF : any =  { type:3, value:'PLANE_SURF'}; static QUADRIC_SURF : any =  { type:3, value:'QUADRIC_SURF'}; static RULED_SURF : any =  { type:3, value:'RULED_SURF'}; static SPHERICAL_SURF : any =  { type:3, value:'SPHERICAL_SURF'}; static SURF_OF_LINEAR_EXTRUSION : any =  { type:3, value:'SURF_OF_LINEAR_EXTRUSION'}; static SURF_OF_REVOLUTION : any =  { type:3, value:'SURF_OF_REVOLUTION'}; static TOROIDAL_SURF : any =  { type:3, value:'TOROIDAL_SURF'}; static UNSPECIFIED : any =  { type:3, value:'UNSPECIFIED'}; 
}
export class IfcBeamTypeEnum {
	static BEAM : any =  { type:3, value:'BEAM'}; static CORNICE : any =  { type:3, value:'CORNICE'}; static DIAPHRAGM : any =  { type:3, value:'DIAPHRAGM'}; static EDGEBEAM : any =  { type:3, value:'EDGEBEAM'}; static GIRDER_SEGMENT : any =  { type:3, value:'GIRDER_SEGMENT'}; static HATSTONE : any =  { type:3, value:'HATSTONE'}; static HOLLOWCORE : any =  { type:3, value:'HOLLOWCORE'}; static JOIST : any =  { type:3, value:'JOIST'}; static LINTEL : any =  { type:3, value:'LINTEL'}; static PIERCAP : any =  { type:3, value:'PIERCAP'}; static SPANDREL : any =  { type:3, value:'SPANDREL'}; static T_BEAM : any =  { type:3, value:'T_BEAM'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcBearingTypeDisplacementEnum {
	static FIXED_MOVEMENT : any =  { type:3, value:'FIXED_MOVEMENT'}; static FREE_MOVEMENT : any =  { type:3, value:'FREE_MOVEMENT'}; static GUIDED_LONGITUDINAL : any =  { type:3, value:'GUIDED_LONGITUDINAL'}; static GUIDED_TRANSVERSAL : any =  { type:3, value:'GUIDED_TRANSVERSAL'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcBearingTypeEnum {
	static CYLINDRICAL : any =  { type:3, value:'CYLINDRICAL'}; static DISK : any =  { type:3, value:'DISK'}; static ELASTOMERIC : any =  { type:3, value:'ELASTOMERIC'}; static GUIDE : any =  { type:3, value:'GUIDE'}; static POT : any =  { type:3, value:'POT'}; static ROCKER : any =  { type:3, value:'ROCKER'}; static ROLLER : any =  { type:3, value:'ROLLER'}; static SPHERICAL : any =  { type:3, value:'SPHERICAL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcBenchmarkEnum {
	static EQUALTO : any =  { type:3, value:'EQUALTO'}; static GREATERTHAN : any =  { type:3, value:'GREATERTHAN'}; static GREATERTHANOREQUALTO : any =  { type:3, value:'GREATERTHANOREQUALTO'}; static INCLUDEDIN : any =  { type:3, value:'INCLUDEDIN'}; static INCLUDES : any =  { type:3, value:'INCLUDES'}; static LESSTHAN : any =  { type:3, value:'LESSTHAN'}; static LESSTHANOREQUALTO : any =  { type:3, value:'LESSTHANOREQUALTO'}; static NOTEQUALTO : any =  { type:3, value:'NOTEQUALTO'}; static NOTINCLUDEDIN : any =  { type:3, value:'NOTINCLUDEDIN'}; static NOTINCLUDES : any =  { type:3, value:'NOTINCLUDES'}; 
}
export class IfcBoilerTypeEnum {
	static STEAM : any =  { type:3, value:'STEAM'}; static WATER : any =  { type:3, value:'WATER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcBooleanOperator {
	static DIFFERENCE : any =  { type:3, value:'DIFFERENCE'}; static INTERSECTION : any =  { type:3, value:'INTERSECTION'}; static UNION : any =  { type:3, value:'UNION'}; 
}
export class IfcBridgePartTypeEnum {
	static ABUTMENT : any =  { type:3, value:'ABUTMENT'}; static DECK : any =  { type:3, value:'DECK'}; static DECK_SEGMENT : any =  { type:3, value:'DECK_SEGMENT'}; static FOUNDATION : any =  { type:3, value:'FOUNDATION'}; static PIER : any =  { type:3, value:'PIER'}; static PIER_SEGMENT : any =  { type:3, value:'PIER_SEGMENT'}; static PYLON : any =  { type:3, value:'PYLON'}; static SUBSTRUCTURE : any =  { type:3, value:'SUBSTRUCTURE'}; static SUPERSTRUCTURE : any =  { type:3, value:'SUPERSTRUCTURE'}; static SURFACESTRUCTURE : any =  { type:3, value:'SURFACESTRUCTURE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcBridgeTypeEnum {
	static ARCHED : any =  { type:3, value:'ARCHED'}; static CABLE_STAYED : any =  { type:3, value:'CABLE_STAYED'}; static CANTILEVER : any =  { type:3, value:'CANTILEVER'}; static CULVERT : any =  { type:3, value:'CULVERT'}; static FRAMEWORK : any =  { type:3, value:'FRAMEWORK'}; static GIRDER : any =  { type:3, value:'GIRDER'}; static SUSPENSION : any =  { type:3, value:'SUSPENSION'}; static TRUSS : any =  { type:3, value:'TRUSS'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcBuildingElementPartTypeEnum {
	static APRON : any =  { type:3, value:'APRON'}; static ARMOURUNIT : any =  { type:3, value:'ARMOURUNIT'}; static INSULATION : any =  { type:3, value:'INSULATION'}; static PRECASTPANEL : any =  { type:3, value:'PRECASTPANEL'}; static SAFETYCAGE : any =  { type:3, value:'SAFETYCAGE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcBuildingElementProxyTypeEnum {
	static COMPLEX : any =  { type:3, value:'COMPLEX'}; static ELEMENT : any =  { type:3, value:'ELEMENT'}; static PARTIAL : any =  { type:3, value:'PARTIAL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcBuildingSystemTypeEnum {
	static EROSIONPREVENTION : any =  { type:3, value:'EROSIONPREVENTION'}; static FENESTRATION : any =  { type:3, value:'FENESTRATION'}; static FOUNDATION : any =  { type:3, value:'FOUNDATION'}; static LOADBEARING : any =  { type:3, value:'LOADBEARING'}; static OUTERSHELL : any =  { type:3, value:'OUTERSHELL'}; static PRESTRESSING : any =  { type:3, value:'PRESTRESSING'}; static REINFORCING : any =  { type:3, value:'REINFORCING'}; static SHADING : any =  { type:3, value:'SHADING'}; static TRANSPORT : any =  { type:3, value:'TRANSPORT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcBuiltSystemTypeEnum {
	static EROSIONPREVENTION : any =  { type:3, value:'EROSIONPREVENTION'}; static FENESTRATION : any =  { type:3, value:'FENESTRATION'}; static FOUNDATION : any =  { type:3, value:'FOUNDATION'}; static LOADBEARING : any =  { type:3, value:'LOADBEARING'}; static MOORING : any =  { type:3, value:'MOORING'}; static OUTERSHELL : any =  { type:3, value:'OUTERSHELL'}; static PRESTRESSING : any =  { type:3, value:'PRESTRESSING'}; static RAILWAYLINE : any =  { type:3, value:'RAILWAYLINE'}; static RAILWAYTRACK : any =  { type:3, value:'RAILWAYTRACK'}; static REINFORCING : any =  { type:3, value:'REINFORCING'}; static SHADING : any =  { type:3, value:'SHADING'}; static TRACKCIRCUIT : any =  { type:3, value:'TRACKCIRCUIT'}; static TRANSPORT : any =  { type:3, value:'TRANSPORT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcBurnerTypeEnum {
	static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCableCarrierFittingTypeEnum {
	static BEND : any =  { type:3, value:'BEND'}; static CONNECTOR : any =  { type:3, value:'CONNECTOR'}; static CROSS : any =  { type:3, value:'CROSS'}; static JUNCTION : any =  { type:3, value:'JUNCTION'}; static TEE : any =  { type:3, value:'TEE'}; static TRANSITION : any =  { type:3, value:'TRANSITION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCableCarrierSegmentTypeEnum {
	static CABLEBRACKET : any =  { type:3, value:'CABLEBRACKET'}; static CABLELADDERSEGMENT : any =  { type:3, value:'CABLELADDERSEGMENT'}; static CABLETRAYSEGMENT : any =  { type:3, value:'CABLETRAYSEGMENT'}; static CABLETRUNKINGSEGMENT : any =  { type:3, value:'CABLETRUNKINGSEGMENT'}; static CATENARYWIRE : any =  { type:3, value:'CATENARYWIRE'}; static CONDUITSEGMENT : any =  { type:3, value:'CONDUITSEGMENT'}; static DROPPER : any =  { type:3, value:'DROPPER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCableFittingTypeEnum {
	static CONNECTOR : any =  { type:3, value:'CONNECTOR'}; static ENTRY : any =  { type:3, value:'ENTRY'}; static EXIT : any =  { type:3, value:'EXIT'}; static FANOUT : any =  { type:3, value:'FANOUT'}; static JUNCTION : any =  { type:3, value:'JUNCTION'}; static TRANSITION : any =  { type:3, value:'TRANSITION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCableSegmentTypeEnum {
	static BUSBARSEGMENT : any =  { type:3, value:'BUSBARSEGMENT'}; static CABLESEGMENT : any =  { type:3, value:'CABLESEGMENT'}; static CONDUCTORSEGMENT : any =  { type:3, value:'CONDUCTORSEGMENT'}; static CONTACTWIRESEGMENT : any =  { type:3, value:'CONTACTWIRESEGMENT'}; static CORESEGMENT : any =  { type:3, value:'CORESEGMENT'}; static FIBERSEGMENT : any =  { type:3, value:'FIBERSEGMENT'}; static FIBERTUBE : any =  { type:3, value:'FIBERTUBE'}; static OPTICALCABLESEGMENT : any =  { type:3, value:'OPTICALCABLESEGMENT'}; static STITCHWIRE : any =  { type:3, value:'STITCHWIRE'}; static WIREPAIRSEGMENT : any =  { type:3, value:'WIREPAIRSEGMENT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCaissonFoundationTypeEnum {
	static CAISSON : any =  { type:3, value:'CAISSON'}; static WELL : any =  { type:3, value:'WELL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcChangeActionEnum {
	static ADDED : any =  { type:3, value:'ADDED'}; static DELETED : any =  { type:3, value:'DELETED'}; static MODIFIED : any =  { type:3, value:'MODIFIED'}; static NOCHANGE : any =  { type:3, value:'NOCHANGE'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcChillerTypeEnum {
	static AIRCOOLED : any =  { type:3, value:'AIRCOOLED'}; static HEATRECOVERY : any =  { type:3, value:'HEATRECOVERY'}; static WATERCOOLED : any =  { type:3, value:'WATERCOOLED'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcChimneyTypeEnum {
	static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCoilTypeEnum {
	static DXCOOLINGCOIL : any =  { type:3, value:'DXCOOLINGCOIL'}; static ELECTRICHEATINGCOIL : any =  { type:3, value:'ELECTRICHEATINGCOIL'}; static GASHEATINGCOIL : any =  { type:3, value:'GASHEATINGCOIL'}; static HYDRONICCOIL : any =  { type:3, value:'HYDRONICCOIL'}; static STEAMHEATINGCOIL : any =  { type:3, value:'STEAMHEATINGCOIL'}; static WATERCOOLINGCOIL : any =  { type:3, value:'WATERCOOLINGCOIL'}; static WATERHEATINGCOIL : any =  { type:3, value:'WATERHEATINGCOIL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcColumnTypeEnum {
	static COLUMN : any =  { type:3, value:'COLUMN'}; static PIERSTEM : any =  { type:3, value:'PIERSTEM'}; static PIERSTEM_SEGMENT : any =  { type:3, value:'PIERSTEM_SEGMENT'}; static PILASTER : any =  { type:3, value:'PILASTER'}; static STANDCOLUMN : any =  { type:3, value:'STANDCOLUMN'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCommunicationsApplianceTypeEnum {
	static ANTENNA : any =  { type:3, value:'ANTENNA'}; static AUTOMATON : any =  { type:3, value:'AUTOMATON'}; static COMPUTER : any =  { type:3, value:'COMPUTER'}; static FAX : any =  { type:3, value:'FAX'}; static GATEWAY : any =  { type:3, value:'GATEWAY'}; static INTELLIGENTPERIPHERAL : any =  { type:3, value:'INTELLIGENTPERIPHERAL'}; static IPNETWORKEQUIPMENT : any =  { type:3, value:'IPNETWORKEQUIPMENT'}; static LINESIDEELECTRONICUNIT : any =  { type:3, value:'LINESIDEELECTRONICUNIT'}; static MODEM : any =  { type:3, value:'MODEM'}; static NETWORKAPPLIANCE : any =  { type:3, value:'NETWORKAPPLIANCE'}; static NETWORKBRIDGE : any =  { type:3, value:'NETWORKBRIDGE'}; static NETWORKHUB : any =  { type:3, value:'NETWORKHUB'}; static OPTICALLINETERMINAL : any =  { type:3, value:'OPTICALLINETERMINAL'}; static OPTICALNETWORKUNIT : any =  { type:3, value:'OPTICALNETWORKUNIT'}; static PRINTER : any =  { type:3, value:'PRINTER'}; static RADIOBLOCKCENTER : any =  { type:3, value:'RADIOBLOCKCENTER'}; static REPEATER : any =  { type:3, value:'REPEATER'}; static ROUTER : any =  { type:3, value:'ROUTER'}; static SCANNER : any =  { type:3, value:'SCANNER'}; static TELECOMMAND : any =  { type:3, value:'TELECOMMAND'}; static TELEPHONYEXCHANGE : any =  { type:3, value:'TELEPHONYEXCHANGE'}; static TRANSITIONCOMPONENT : any =  { type:3, value:'TRANSITIONCOMPONENT'}; static TRANSPONDER : any =  { type:3, value:'TRANSPONDER'}; static TRANSPORTEQUIPMENT : any =  { type:3, value:'TRANSPORTEQUIPMENT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcComplexPropertyTemplateTypeEnum {
	static P_COMPLEX : any =  { type:3, value:'P_COMPLEX'}; static Q_COMPLEX : any =  { type:3, value:'Q_COMPLEX'}; 
}
export class IfcCompressorTypeEnum {
	static BOOSTER : any =  { type:3, value:'BOOSTER'}; static DYNAMIC : any =  { type:3, value:'DYNAMIC'}; static HERMETIC : any =  { type:3, value:'HERMETIC'}; static OPENTYPE : any =  { type:3, value:'OPENTYPE'}; static RECIPROCATING : any =  { type:3, value:'RECIPROCATING'}; static ROLLINGPISTON : any =  { type:3, value:'ROLLINGPISTON'}; static ROTARY : any =  { type:3, value:'ROTARY'}; static ROTARYVANE : any =  { type:3, value:'ROTARYVANE'}; static SCROLL : any =  { type:3, value:'SCROLL'}; static SEMIHERMETIC : any =  { type:3, value:'SEMIHERMETIC'}; static SINGLESCREW : any =  { type:3, value:'SINGLESCREW'}; static SINGLESTAGE : any =  { type:3, value:'SINGLESTAGE'}; static TROCHOIDAL : any =  { type:3, value:'TROCHOIDAL'}; static TWINSCREW : any =  { type:3, value:'TWINSCREW'}; static WELDEDSHELLHERMETIC : any =  { type:3, value:'WELDEDSHELLHERMETIC'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCondenserTypeEnum {
	static AIRCOOLED : any =  { type:3, value:'AIRCOOLED'}; static EVAPORATIVECOOLED : any =  { type:3, value:'EVAPORATIVECOOLED'}; static WATERCOOLED : any =  { type:3, value:'WATERCOOLED'}; static WATERCOOLEDBRAZEDPLATE : any =  { type:3, value:'WATERCOOLEDBRAZEDPLATE'}; static WATERCOOLEDSHELLCOIL : any =  { type:3, value:'WATERCOOLEDSHELLCOIL'}; static WATERCOOLEDSHELLTUBE : any =  { type:3, value:'WATERCOOLEDSHELLTUBE'}; static WATERCOOLEDTUBEINTUBE : any =  { type:3, value:'WATERCOOLEDTUBEINTUBE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcConnectionTypeEnum {
	static ATEND : any =  { type:3, value:'ATEND'}; static ATPATH : any =  { type:3, value:'ATPATH'}; static ATSTART : any =  { type:3, value:'ATSTART'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcConstraintEnum {
	static ADVISORY : any =  { type:3, value:'ADVISORY'}; static HARD : any =  { type:3, value:'HARD'}; static SOFT : any =  { type:3, value:'SOFT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcConstructionEquipmentResourceTypeEnum {
	static DEMOLISHING : any =  { type:3, value:'DEMOLISHING'}; static EARTHMOVING : any =  { type:3, value:'EARTHMOVING'}; static ERECTING : any =  { type:3, value:'ERECTING'}; static HEATING : any =  { type:3, value:'HEATING'}; static LIGHTING : any =  { type:3, value:'LIGHTING'}; static PAVING : any =  { type:3, value:'PAVING'}; static PUMPING : any =  { type:3, value:'PUMPING'}; static TRANSPORTING : any =  { type:3, value:'TRANSPORTING'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcConstructionMaterialResourceTypeEnum {
	static AGGREGATES : any =  { type:3, value:'AGGREGATES'}; static CONCRETE : any =  { type:3, value:'CONCRETE'}; static DRYWALL : any =  { type:3, value:'DRYWALL'}; static FUEL : any =  { type:3, value:'FUEL'}; static GYPSUM : any =  { type:3, value:'GYPSUM'}; static MASONRY : any =  { type:3, value:'MASONRY'}; static METAL : any =  { type:3, value:'METAL'}; static PLASTIC : any =  { type:3, value:'PLASTIC'}; static WOOD : any =  { type:3, value:'WOOD'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcConstructionProductResourceTypeEnum {
	static ASSEMBLY : any =  { type:3, value:'ASSEMBLY'}; static FORMWORK : any =  { type:3, value:'FORMWORK'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcControllerTypeEnum {
	static FLOATING : any =  { type:3, value:'FLOATING'}; static MULTIPOSITION : any =  { type:3, value:'MULTIPOSITION'}; static PROGRAMMABLE : any =  { type:3, value:'PROGRAMMABLE'}; static PROPORTIONAL : any =  { type:3, value:'PROPORTIONAL'}; static TWOPOSITION : any =  { type:3, value:'TWOPOSITION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcConveyorSegmentTypeEnum {
	static BELTCONVEYOR : any =  { type:3, value:'BELTCONVEYOR'}; static BUCKETCONVEYOR : any =  { type:3, value:'BUCKETCONVEYOR'}; static CHUTECONVEYOR : any =  { type:3, value:'CHUTECONVEYOR'}; static SCREWCONVEYOR : any =  { type:3, value:'SCREWCONVEYOR'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCooledBeamTypeEnum {
	static ACTIVE : any =  { type:3, value:'ACTIVE'}; static PASSIVE : any =  { type:3, value:'PASSIVE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCoolingTowerTypeEnum {
	static MECHANICALFORCEDDRAFT : any =  { type:3, value:'MECHANICALFORCEDDRAFT'}; static MECHANICALINDUCEDDRAFT : any =  { type:3, value:'MECHANICALINDUCEDDRAFT'}; static NATURALDRAFT : any =  { type:3, value:'NATURALDRAFT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCostItemTypeEnum {
	static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCostScheduleTypeEnum {
	static BUDGET : any =  { type:3, value:'BUDGET'}; static COSTPLAN : any =  { type:3, value:'COSTPLAN'}; static ESTIMATE : any =  { type:3, value:'ESTIMATE'}; static PRICEDBILLOFQUANTITIES : any =  { type:3, value:'PRICEDBILLOFQUANTITIES'}; static SCHEDULEOFRATES : any =  { type:3, value:'SCHEDULEOFRATES'}; static TENDER : any =  { type:3, value:'TENDER'}; static UNPRICEDBILLOFQUANTITIES : any =  { type:3, value:'UNPRICEDBILLOFQUANTITIES'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCourseTypeEnum {
	static ARMOUR : any =  { type:3, value:'ARMOUR'}; static BALLASTBED : any =  { type:3, value:'BALLASTBED'}; static CORE : any =  { type:3, value:'CORE'}; static FILTER : any =  { type:3, value:'FILTER'}; static PAVEMENT : any =  { type:3, value:'PAVEMENT'}; static PROTECTION : any =  { type:3, value:'PROTECTION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcCoveringTypeEnum {
	static CEILING : any =  { type:3, value:'CEILING'}; static CLADDING : any =  { type:3, value:'CLADDING'}; static COPING : any =  { type:3, value:'COPING'}; static FLOORING : any =  { type:3, value:'FLOORING'}; static INSULATION : any =  { type:3, value:'INSULATION'}; static MEMBRANE : any =  { type:3, value:'MEMBRANE'}; static MOLDING : any =  { type:3, value:'MOLDING'}; static ROOFING : any =  { type:3, value:'ROOFING'}; static SKIRTINGBOARD : any =  { type:3, value:'SKIRTINGBOARD'}; static SLEEVING : any =  { type:3, value:'SLEEVING'}; static TOPPING : any =  { type:3, value:'TOPPING'}; static WRAPPING : any =  { type:3, value:'WRAPPING'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
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
	static ACCELERATIONUNIT : any =  { type:3, value:'ACCELERATIONUNIT'}; static ANGULARVELOCITYUNIT : any =  { type:3, value:'ANGULARVELOCITYUNIT'}; static AREADENSITYUNIT : any =  { type:3, value:'AREADENSITYUNIT'}; static COMPOUNDPLANEANGLEUNIT : any =  { type:3, value:'COMPOUNDPLANEANGLEUNIT'}; static CURVATUREUNIT : any =  { type:3, value:'CURVATUREUNIT'}; static DYNAMICVISCOSITYUNIT : any =  { type:3, value:'DYNAMICVISCOSITYUNIT'}; static HEATFLUXDENSITYUNIT : any =  { type:3, value:'HEATFLUXDENSITYUNIT'}; static HEATINGVALUEUNIT : any =  { type:3, value:'HEATINGVALUEUNIT'}; static INTEGERCOUNTRATEUNIT : any =  { type:3, value:'INTEGERCOUNTRATEUNIT'}; static IONCONCENTRATIONUNIT : any =  { type:3, value:'IONCONCENTRATIONUNIT'}; static ISOTHERMALMOISTURECAPACITYUNIT : any =  { type:3, value:'ISOTHERMALMOISTURECAPACITYUNIT'}; static KINEMATICVISCOSITYUNIT : any =  { type:3, value:'KINEMATICVISCOSITYUNIT'}; static LINEARFORCEUNIT : any =  { type:3, value:'LINEARFORCEUNIT'}; static LINEARMOMENTUNIT : any =  { type:3, value:'LINEARMOMENTUNIT'}; static LINEARSTIFFNESSUNIT : any =  { type:3, value:'LINEARSTIFFNESSUNIT'}; static LINEARVELOCITYUNIT : any =  { type:3, value:'LINEARVELOCITYUNIT'}; static LUMINOUSINTENSITYDISTRIBUTIONUNIT : any =  { type:3, value:'LUMINOUSINTENSITYDISTRIBUTIONUNIT'}; static MASSDENSITYUNIT : any =  { type:3, value:'MASSDENSITYUNIT'}; static MASSFLOWRATEUNIT : any =  { type:3, value:'MASSFLOWRATEUNIT'}; static MASSPERLENGTHUNIT : any =  { type:3, value:'MASSPERLENGTHUNIT'}; static MODULUSOFELASTICITYUNIT : any =  { type:3, value:'MODULUSOFELASTICITYUNIT'}; static MODULUSOFLINEARSUBGRADEREACTIONUNIT : any =  { type:3, value:'MODULUSOFLINEARSUBGRADEREACTIONUNIT'}; static MODULUSOFROTATIONALSUBGRADEREACTIONUNIT : any =  { type:3, value:'MODULUSOFROTATIONALSUBGRADEREACTIONUNIT'}; static MODULUSOFSUBGRADEREACTIONUNIT : any =  { type:3, value:'MODULUSOFSUBGRADEREACTIONUNIT'}; static MOISTUREDIFFUSIVITYUNIT : any =  { type:3, value:'MOISTUREDIFFUSIVITYUNIT'}; static MOLECULARWEIGHTUNIT : any =  { type:3, value:'MOLECULARWEIGHTUNIT'}; static MOMENTOFINERTIAUNIT : any =  { type:3, value:'MOMENTOFINERTIAUNIT'}; static PHUNIT : any =  { type:3, value:'PHUNIT'}; static PLANARFORCEUNIT : any =  { type:3, value:'PLANARFORCEUNIT'}; static ROTATIONALFREQUENCYUNIT : any =  { type:3, value:'ROTATIONALFREQUENCYUNIT'}; static ROTATIONALMASSUNIT : any =  { type:3, value:'ROTATIONALMASSUNIT'}; static ROTATIONALSTIFFNESSUNIT : any =  { type:3, value:'ROTATIONALSTIFFNESSUNIT'}; static SECTIONAREAINTEGRALUNIT : any =  { type:3, value:'SECTIONAREAINTEGRALUNIT'}; static SECTIONMODULUSUNIT : any =  { type:3, value:'SECTIONMODULUSUNIT'}; static SHEARMODULUSUNIT : any =  { type:3, value:'SHEARMODULUSUNIT'}; static SOUNDPOWERLEVELUNIT : any =  { type:3, value:'SOUNDPOWERLEVELUNIT'}; static SOUNDPOWERUNIT : any =  { type:3, value:'SOUNDPOWERUNIT'}; static SOUNDPRESSURELEVELUNIT : any =  { type:3, value:'SOUNDPRESSURELEVELUNIT'}; static SOUNDPRESSUREUNIT : any =  { type:3, value:'SOUNDPRESSUREUNIT'}; static SPECIFICHEATCAPACITYUNIT : any =  { type:3, value:'SPECIFICHEATCAPACITYUNIT'}; static TEMPERATUREGRADIENTUNIT : any =  { type:3, value:'TEMPERATUREGRADIENTUNIT'}; static TEMPERATURERATEOFCHANGEUNIT : any =  { type:3, value:'TEMPERATURERATEOFCHANGEUNIT'}; static THERMALADMITTANCEUNIT : any =  { type:3, value:'THERMALADMITTANCEUNIT'}; static THERMALCONDUCTANCEUNIT : any =  { type:3, value:'THERMALCONDUCTANCEUNIT'}; static THERMALEXPANSIONCOEFFICIENTUNIT : any =  { type:3, value:'THERMALEXPANSIONCOEFFICIENTUNIT'}; static THERMALRESISTANCEUNIT : any =  { type:3, value:'THERMALRESISTANCEUNIT'}; static THERMALTRANSMITTANCEUNIT : any =  { type:3, value:'THERMALTRANSMITTANCEUNIT'}; static TORQUEUNIT : any =  { type:3, value:'TORQUEUNIT'}; static VAPORPERMEABILITYUNIT : any =  { type:3, value:'VAPORPERMEABILITYUNIT'}; static VOLUMETRICFLOWRATEUNIT : any =  { type:3, value:'VOLUMETRICFLOWRATEUNIT'}; static WARPINGCONSTANTUNIT : any =  { type:3, value:'WARPINGCONSTANTUNIT'}; static WARPINGMOMENTUNIT : any =  { type:3, value:'WARPINGMOMENTUNIT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; 
}
export class IfcDirectionSenseEnum {
	static NEGATIVE : any =  { type:3, value:'NEGATIVE'}; static POSITIVE : any =  { type:3, value:'POSITIVE'}; 
}
export class IfcDiscreteAccessoryTypeEnum {
	static ANCHORPLATE : any =  { type:3, value:'ANCHORPLATE'}; static BIRDPROTECTION : any =  { type:3, value:'BIRDPROTECTION'}; static BRACKET : any =  { type:3, value:'BRACKET'}; static CABLEARRANGER : any =  { type:3, value:'CABLEARRANGER'}; static ELASTIC_CUSHION : any =  { type:3, value:'ELASTIC_CUSHION'}; static EXPANSION_JOINT_DEVICE : any =  { type:3, value:'EXPANSION_JOINT_DEVICE'}; static FILLER : any =  { type:3, value:'FILLER'}; static FLASHING : any =  { type:3, value:'FLASHING'}; static INSULATOR : any =  { type:3, value:'INSULATOR'}; static LOCK : any =  { type:3, value:'LOCK'}; static PANEL_STRENGTHENING : any =  { type:3, value:'PANEL_STRENGTHENING'}; static POINTMACHINEMOUNTINGDEVICE : any =  { type:3, value:'POINTMACHINEMOUNTINGDEVICE'}; static POINT_MACHINE_LOCKING_DEVICE : any =  { type:3, value:'POINT_MACHINE_LOCKING_DEVICE'}; static RAILBRACE : any =  { type:3, value:'RAILBRACE'}; static RAILPAD : any =  { type:3, value:'RAILPAD'}; static RAIL_LUBRICATION : any =  { type:3, value:'RAIL_LUBRICATION'}; static RAIL_MECHANICAL_EQUIPMENT : any =  { type:3, value:'RAIL_MECHANICAL_EQUIPMENT'}; static SHOE : any =  { type:3, value:'SHOE'}; static SLIDINGCHAIR : any =  { type:3, value:'SLIDINGCHAIR'}; static SOUNDABSORPTION : any =  { type:3, value:'SOUNDABSORPTION'}; static TENSIONINGEQUIPMENT : any =  { type:3, value:'TENSIONINGEQUIPMENT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDistributionBoardTypeEnum {
	static CONSUMERUNIT : any =  { type:3, value:'CONSUMERUNIT'}; static DISPATCHINGBOARD : any =  { type:3, value:'DISPATCHINGBOARD'}; static DISTRIBUTIONBOARD : any =  { type:3, value:'DISTRIBUTIONBOARD'}; static DISTRIBUTIONFRAME : any =  { type:3, value:'DISTRIBUTIONFRAME'}; static MOTORCONTROLCENTRE : any =  { type:3, value:'MOTORCONTROLCENTRE'}; static SWITCHBOARD : any =  { type:3, value:'SWITCHBOARD'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDistributionChamberElementTypeEnum {
	static FORMEDDUCT : any =  { type:3, value:'FORMEDDUCT'}; static INSPECTIONCHAMBER : any =  { type:3, value:'INSPECTIONCHAMBER'}; static INSPECTIONPIT : any =  { type:3, value:'INSPECTIONPIT'}; static MANHOLE : any =  { type:3, value:'MANHOLE'}; static METERCHAMBER : any =  { type:3, value:'METERCHAMBER'}; static SUMP : any =  { type:3, value:'SUMP'}; static TRENCH : any =  { type:3, value:'TRENCH'}; static VALVECHAMBER : any =  { type:3, value:'VALVECHAMBER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDistributionPortTypeEnum {
	static CABLE : any =  { type:3, value:'CABLE'}; static CABLECARRIER : any =  { type:3, value:'CABLECARRIER'}; static DUCT : any =  { type:3, value:'DUCT'}; static PIPE : any =  { type:3, value:'PIPE'}; static WIRELESS : any =  { type:3, value:'WIRELESS'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDistributionSystemEnum {
	static AIRCONDITIONING : any =  { type:3, value:'AIRCONDITIONING'}; static AUDIOVISUAL : any =  { type:3, value:'AUDIOVISUAL'}; static CATENARY_SYSTEM : any =  { type:3, value:'CATENARY_SYSTEM'}; static CHEMICAL : any =  { type:3, value:'CHEMICAL'}; static CHILLEDWATER : any =  { type:3, value:'CHILLEDWATER'}; static COMMUNICATION : any =  { type:3, value:'COMMUNICATION'}; static COMPRESSEDAIR : any =  { type:3, value:'COMPRESSEDAIR'}; static CONDENSERWATER : any =  { type:3, value:'CONDENSERWATER'}; static CONTROL : any =  { type:3, value:'CONTROL'}; static CONVEYING : any =  { type:3, value:'CONVEYING'}; static DATA : any =  { type:3, value:'DATA'}; static DISPOSAL : any =  { type:3, value:'DISPOSAL'}; static DOMESTICCOLDWATER : any =  { type:3, value:'DOMESTICCOLDWATER'}; static DOMESTICHOTWATER : any =  { type:3, value:'DOMESTICHOTWATER'}; static DRAINAGE : any =  { type:3, value:'DRAINAGE'}; static EARTHING : any =  { type:3, value:'EARTHING'}; static ELECTRICAL : any =  { type:3, value:'ELECTRICAL'}; static ELECTROACOUSTIC : any =  { type:3, value:'ELECTROACOUSTIC'}; static EXHAUST : any =  { type:3, value:'EXHAUST'}; static FIREPROTECTION : any =  { type:3, value:'FIREPROTECTION'}; static FIXEDTRANSMISSIONNETWORK : any =  { type:3, value:'FIXEDTRANSMISSIONNETWORK'}; static FUEL : any =  { type:3, value:'FUEL'}; static GAS : any =  { type:3, value:'GAS'}; static HAZARDOUS : any =  { type:3, value:'HAZARDOUS'}; static HEATING : any =  { type:3, value:'HEATING'}; static LIGHTING : any =  { type:3, value:'LIGHTING'}; static LIGHTNINGPROTECTION : any =  { type:3, value:'LIGHTNINGPROTECTION'}; static MOBILENETWORK : any =  { type:3, value:'MOBILENETWORK'}; static MONITORINGSYSTEM : any =  { type:3, value:'MONITORINGSYSTEM'}; static MUNICIPALSOLIDWASTE : any =  { type:3, value:'MUNICIPALSOLIDWASTE'}; static OIL : any =  { type:3, value:'OIL'}; static OPERATIONAL : any =  { type:3, value:'OPERATIONAL'}; static OPERATIONALTELEPHONYSYSTEM : any =  { type:3, value:'OPERATIONALTELEPHONYSYSTEM'}; static OVERHEAD_CONTACTLINE_SYSTEM : any =  { type:3, value:'OVERHEAD_CONTACTLINE_SYSTEM'}; static POWERGENERATION : any =  { type:3, value:'POWERGENERATION'}; static RAINWATER : any =  { type:3, value:'RAINWATER'}; static REFRIGERATION : any =  { type:3, value:'REFRIGERATION'}; static RETURN_CIRCUIT : any =  { type:3, value:'RETURN_CIRCUIT'}; static SECURITY : any =  { type:3, value:'SECURITY'}; static SEWAGE : any =  { type:3, value:'SEWAGE'}; static SIGNAL : any =  { type:3, value:'SIGNAL'}; static STORMWATER : any =  { type:3, value:'STORMWATER'}; static TELEPHONE : any =  { type:3, value:'TELEPHONE'}; static TV : any =  { type:3, value:'TV'}; static VACUUM : any =  { type:3, value:'VACUUM'}; static VENT : any =  { type:3, value:'VENT'}; static VENTILATION : any =  { type:3, value:'VENTILATION'}; static WASTEWATER : any =  { type:3, value:'WASTEWATER'}; static WATERSUPPLY : any =  { type:3, value:'WATERSUPPLY'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDocumentConfidentialityEnum {
	static CONFIDENTIAL : any =  { type:3, value:'CONFIDENTIAL'}; static PERSONAL : any =  { type:3, value:'PERSONAL'}; static PUBLIC : any =  { type:3, value:'PUBLIC'}; static RESTRICTED : any =  { type:3, value:'RESTRICTED'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDocumentStatusEnum {
	static DRAFT : any =  { type:3, value:'DRAFT'}; static FINAL : any =  { type:3, value:'FINAL'}; static FINALDRAFT : any =  { type:3, value:'FINALDRAFT'}; static REVISION : any =  { type:3, value:'REVISION'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDoorPanelOperationEnum {
	static DOUBLE_ACTING : any =  { type:3, value:'DOUBLE_ACTING'}; static FIXEDPANEL : any =  { type:3, value:'FIXEDPANEL'}; static FOLDING : any =  { type:3, value:'FOLDING'}; static REVOLVING : any =  { type:3, value:'REVOLVING'}; static ROLLINGUP : any =  { type:3, value:'ROLLINGUP'}; static SLIDING : any =  { type:3, value:'SLIDING'}; static SWINGING : any =  { type:3, value:'SWINGING'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDoorPanelPositionEnum {
	static LEFT : any =  { type:3, value:'LEFT'}; static MIDDLE : any =  { type:3, value:'MIDDLE'}; static RIGHT : any =  { type:3, value:'RIGHT'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDoorStyleConstructionEnum {
	static ALUMINIUM : any =  { type:3, value:'ALUMINIUM'}; static ALUMINIUM_PLASTIC : any =  { type:3, value:'ALUMINIUM_PLASTIC'}; static ALUMINIUM_WOOD : any =  { type:3, value:'ALUMINIUM_WOOD'}; static HIGH_GRADE_STEEL : any =  { type:3, value:'HIGH_GRADE_STEEL'}; static PLASTIC : any =  { type:3, value:'PLASTIC'}; static STEEL : any =  { type:3, value:'STEEL'}; static WOOD : any =  { type:3, value:'WOOD'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDoorStyleOperationEnum {
	static DOUBLE_DOOR_DOUBLE_SWING : any =  { type:3, value:'DOUBLE_DOOR_DOUBLE_SWING'}; static DOUBLE_DOOR_FOLDING : any =  { type:3, value:'DOUBLE_DOOR_FOLDING'}; static DOUBLE_DOOR_SINGLE_SWING : any =  { type:3, value:'DOUBLE_DOOR_SINGLE_SWING'}; static DOUBLE_DOOR_SINGLE_SWING_OPPOSITE_LEFT : any =  { type:3, value:'DOUBLE_DOOR_SINGLE_SWING_OPPOSITE_LEFT'}; static DOUBLE_DOOR_SINGLE_SWING_OPPOSITE_RIGHT : any =  { type:3, value:'DOUBLE_DOOR_SINGLE_SWING_OPPOSITE_RIGHT'}; static DOUBLE_DOOR_SLIDING : any =  { type:3, value:'DOUBLE_DOOR_SLIDING'}; static DOUBLE_SWING_LEFT : any =  { type:3, value:'DOUBLE_SWING_LEFT'}; static DOUBLE_SWING_RIGHT : any =  { type:3, value:'DOUBLE_SWING_RIGHT'}; static FOLDING_TO_LEFT : any =  { type:3, value:'FOLDING_TO_LEFT'}; static FOLDING_TO_RIGHT : any =  { type:3, value:'FOLDING_TO_RIGHT'}; static REVOLVING : any =  { type:3, value:'REVOLVING'}; static ROLLINGUP : any =  { type:3, value:'ROLLINGUP'}; static SINGLE_SWING_LEFT : any =  { type:3, value:'SINGLE_SWING_LEFT'}; static SINGLE_SWING_RIGHT : any =  { type:3, value:'SINGLE_SWING_RIGHT'}; static SLIDING_TO_LEFT : any =  { type:3, value:'SLIDING_TO_LEFT'}; static SLIDING_TO_RIGHT : any =  { type:3, value:'SLIDING_TO_RIGHT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDoorTypeEnum {
	static BOOM_BARRIER : any =  { type:3, value:'BOOM_BARRIER'}; static DOOR : any =  { type:3, value:'DOOR'}; static GATE : any =  { type:3, value:'GATE'}; static TRAPDOOR : any =  { type:3, value:'TRAPDOOR'}; static TURNSTILE : any =  { type:3, value:'TURNSTILE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDoorTypeOperationEnum {
	static DOUBLE_PANEL_DOUBLE_SWING : any =  { type:3, value:'DOUBLE_PANEL_DOUBLE_SWING'}; static DOUBLE_PANEL_FOLDING : any =  { type:3, value:'DOUBLE_PANEL_FOLDING'}; static DOUBLE_PANEL_LIFTING_VERTICAL : any =  { type:3, value:'DOUBLE_PANEL_LIFTING_VERTICAL'}; static DOUBLE_PANEL_SINGLE_SWING : any =  { type:3, value:'DOUBLE_PANEL_SINGLE_SWING'}; static DOUBLE_PANEL_SINGLE_SWING_OPPOSITE_LEFT : any =  { type:3, value:'DOUBLE_PANEL_SINGLE_SWING_OPPOSITE_LEFT'}; static DOUBLE_PANEL_SINGLE_SWING_OPPOSITE_RIGHT : any =  { type:3, value:'DOUBLE_PANEL_SINGLE_SWING_OPPOSITE_RIGHT'}; static DOUBLE_PANEL_SLIDING : any =  { type:3, value:'DOUBLE_PANEL_SLIDING'}; static DOUBLE_SWING_LEFT : any =  { type:3, value:'DOUBLE_SWING_LEFT'}; static DOUBLE_SWING_RIGHT : any =  { type:3, value:'DOUBLE_SWING_RIGHT'}; static FOLDING_TO_LEFT : any =  { type:3, value:'FOLDING_TO_LEFT'}; static FOLDING_TO_RIGHT : any =  { type:3, value:'FOLDING_TO_RIGHT'}; static LIFTING_HORIZONTAL : any =  { type:3, value:'LIFTING_HORIZONTAL'}; static LIFTING_VERTICAL_LEFT : any =  { type:3, value:'LIFTING_VERTICAL_LEFT'}; static LIFTING_VERTICAL_RIGHT : any =  { type:3, value:'LIFTING_VERTICAL_RIGHT'}; static REVOLVING_HORIZONTAL : any =  { type:3, value:'REVOLVING_HORIZONTAL'}; static REVOLVING_VERTICAL : any =  { type:3, value:'REVOLVING_VERTICAL'}; static ROLLINGUP : any =  { type:3, value:'ROLLINGUP'}; static SINGLE_SWING_LEFT : any =  { type:3, value:'SINGLE_SWING_LEFT'}; static SINGLE_SWING_RIGHT : any =  { type:3, value:'SINGLE_SWING_RIGHT'}; static SLIDING_TO_LEFT : any =  { type:3, value:'SLIDING_TO_LEFT'}; static SLIDING_TO_RIGHT : any =  { type:3, value:'SLIDING_TO_RIGHT'}; static SWING_FIXED_LEFT : any =  { type:3, value:'SWING_FIXED_LEFT'}; static SWING_FIXED_RIGHT : any =  { type:3, value:'SWING_FIXED_RIGHT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDuctFittingTypeEnum {
	static BEND : any =  { type:3, value:'BEND'}; static CONNECTOR : any =  { type:3, value:'CONNECTOR'}; static ENTRY : any =  { type:3, value:'ENTRY'}; static EXIT : any =  { type:3, value:'EXIT'}; static JUNCTION : any =  { type:3, value:'JUNCTION'}; static OBSTRUCTION : any =  { type:3, value:'OBSTRUCTION'}; static TRANSITION : any =  { type:3, value:'TRANSITION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDuctSegmentTypeEnum {
	static FLEXIBLESEGMENT : any =  { type:3, value:'FLEXIBLESEGMENT'}; static RIGIDSEGMENT : any =  { type:3, value:'RIGIDSEGMENT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcDuctSilencerTypeEnum {
	static FLATOVAL : any =  { type:3, value:'FLATOVAL'}; static RECTANGULAR : any =  { type:3, value:'RECTANGULAR'}; static ROUND : any =  { type:3, value:'ROUND'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcEarthworksCutTypeEnum {
	static BASE_EXCAVATION : any =  { type:3, value:'BASE_EXCAVATION'}; static CUT : any =  { type:3, value:'CUT'}; static DREDGING : any =  { type:3, value:'DREDGING'}; static EXCAVATION : any =  { type:3, value:'EXCAVATION'}; static OVEREXCAVATION : any =  { type:3, value:'OVEREXCAVATION'}; static PAVEMENTMILLING : any =  { type:3, value:'PAVEMENTMILLING'}; static STEPEXCAVATION : any =  { type:3, value:'STEPEXCAVATION'}; static TOPSOILREMOVAL : any =  { type:3, value:'TOPSOILREMOVAL'}; static TRENCH : any =  { type:3, value:'TRENCH'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcEarthworksFillTypeEnum {
	static BACKFILL : any =  { type:3, value:'BACKFILL'}; static COUNTERWEIGHT : any =  { type:3, value:'COUNTERWEIGHT'}; static EMBANKMENT : any =  { type:3, value:'EMBANKMENT'}; static SLOPEFILL : any =  { type:3, value:'SLOPEFILL'}; static SUBGRADE : any =  { type:3, value:'SUBGRADE'}; static SUBGRADEBED : any =  { type:3, value:'SUBGRADEBED'}; static TRANSITIONSECTION : any =  { type:3, value:'TRANSITIONSECTION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcElectricApplianceTypeEnum {
	static DISHWASHER : any =  { type:3, value:'DISHWASHER'}; static ELECTRICCOOKER : any =  { type:3, value:'ELECTRICCOOKER'}; static FREESTANDINGELECTRICHEATER : any =  { type:3, value:'FREESTANDINGELECTRICHEATER'}; static FREESTANDINGFAN : any =  { type:3, value:'FREESTANDINGFAN'}; static FREESTANDINGWATERCOOLER : any =  { type:3, value:'FREESTANDINGWATERCOOLER'}; static FREESTANDINGWATERHEATER : any =  { type:3, value:'FREESTANDINGWATERHEATER'}; static FREEZER : any =  { type:3, value:'FREEZER'}; static FRIDGE_FREEZER : any =  { type:3, value:'FRIDGE_FREEZER'}; static HANDDRYER : any =  { type:3, value:'HANDDRYER'}; static KITCHENMACHINE : any =  { type:3, value:'KITCHENMACHINE'}; static MICROWAVE : any =  { type:3, value:'MICROWAVE'}; static PHOTOCOPIER : any =  { type:3, value:'PHOTOCOPIER'}; static REFRIGERATOR : any =  { type:3, value:'REFRIGERATOR'}; static TUMBLEDRYER : any =  { type:3, value:'TUMBLEDRYER'}; static VENDINGMACHINE : any =  { type:3, value:'VENDINGMACHINE'}; static WASHINGMACHINE : any =  { type:3, value:'WASHINGMACHINE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcElectricDistributionBoardTypeEnum {
	static CONSUMERUNIT : any =  { type:3, value:'CONSUMERUNIT'}; static DISTRIBUTIONBOARD : any =  { type:3, value:'DISTRIBUTIONBOARD'}; static MOTORCONTROLCENTRE : any =  { type:3, value:'MOTORCONTROLCENTRE'}; static SWITCHBOARD : any =  { type:3, value:'SWITCHBOARD'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcElectricFlowStorageDeviceTypeEnum {
	static BATTERY : any =  { type:3, value:'BATTERY'}; static CAPACITOR : any =  { type:3, value:'CAPACITOR'}; static CAPACITORBANK : any =  { type:3, value:'CAPACITORBANK'}; static COMPENSATOR : any =  { type:3, value:'COMPENSATOR'}; static HARMONICFILTER : any =  { type:3, value:'HARMONICFILTER'}; static INDUCTOR : any =  { type:3, value:'INDUCTOR'}; static INDUCTORBANK : any =  { type:3, value:'INDUCTORBANK'}; static RECHARGER : any =  { type:3, value:'RECHARGER'}; static UPS : any =  { type:3, value:'UPS'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcElectricFlowTreatmentDeviceTypeEnum {
	static ELECTRONICFILTER : any =  { type:3, value:'ELECTRONICFILTER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcElectricGeneratorTypeEnum {
	static CHP : any =  { type:3, value:'CHP'}; static ENGINEGENERATOR : any =  { type:3, value:'ENGINEGENERATOR'}; static STANDALONE : any =  { type:3, value:'STANDALONE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcElectricMotorTypeEnum {
	static DC : any =  { type:3, value:'DC'}; static INDUCTION : any =  { type:3, value:'INDUCTION'}; static POLYPHASE : any =  { type:3, value:'POLYPHASE'}; static RELUCTANCESYNCHRONOUS : any =  { type:3, value:'RELUCTANCESYNCHRONOUS'}; static SYNCHRONOUS : any =  { type:3, value:'SYNCHRONOUS'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcElectricTimeControlTypeEnum {
	static RELAY : any =  { type:3, value:'RELAY'}; static TIMECLOCK : any =  { type:3, value:'TIMECLOCK'}; static TIMEDELAY : any =  { type:3, value:'TIMEDELAY'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcElementAssemblyTypeEnum {
	static ABUTMENT : any =  { type:3, value:'ABUTMENT'}; static ACCESSORY_ASSEMBLY : any =  { type:3, value:'ACCESSORY_ASSEMBLY'}; static ARCH : any =  { type:3, value:'ARCH'}; static BEAM_GRID : any =  { type:3, value:'BEAM_GRID'}; static BRACED_FRAME : any =  { type:3, value:'BRACED_FRAME'}; static CROSS_BRACING : any =  { type:3, value:'CROSS_BRACING'}; static DECK : any =  { type:3, value:'DECK'}; static DILATATIONPANEL : any =  { type:3, value:'DILATATIONPANEL'}; static ENTRANCEWORKS : any =  { type:3, value:'ENTRANCEWORKS'}; static GIRDER : any =  { type:3, value:'GIRDER'}; static GRID : any =  { type:3, value:'GRID'}; static MAST : any =  { type:3, value:'MAST'}; static PIER : any =  { type:3, value:'PIER'}; static PYLON : any =  { type:3, value:'PYLON'}; static RAIL_MECHANICAL_EQUIPMENT_ASSEMBLY : any =  { type:3, value:'RAIL_MECHANICAL_EQUIPMENT_ASSEMBLY'}; static REINFORCEMENT_UNIT : any =  { type:3, value:'REINFORCEMENT_UNIT'}; static RIGID_FRAME : any =  { type:3, value:'RIGID_FRAME'}; static SHELTER : any =  { type:3, value:'SHELTER'}; static SIGNALASSEMBLY : any =  { type:3, value:'SIGNALASSEMBLY'}; static SLAB_FIELD : any =  { type:3, value:'SLAB_FIELD'}; static SUMPBUSTER : any =  { type:3, value:'SUMPBUSTER'}; static SUPPORTINGASSEMBLY : any =  { type:3, value:'SUPPORTINGASSEMBLY'}; static SUSPENSIONASSEMBLY : any =  { type:3, value:'SUSPENSIONASSEMBLY'}; static TRACKPANEL : any =  { type:3, value:'TRACKPANEL'}; static TRACTION_SWITCHING_ASSEMBLY : any =  { type:3, value:'TRACTION_SWITCHING_ASSEMBLY'}; static TRAFFIC_CALMING_DEVICE : any =  { type:3, value:'TRAFFIC_CALMING_DEVICE'}; static TRUSS : any =  { type:3, value:'TRUSS'}; static TURNOUTPANEL : any =  { type:3, value:'TURNOUTPANEL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcElementCompositionEnum {
	static COMPLEX : any =  { type:3, value:'COMPLEX'}; static ELEMENT : any =  { type:3, value:'ELEMENT'}; static PARTIAL : any =  { type:3, value:'PARTIAL'}; 
}
export class IfcEngineTypeEnum {
	static EXTERNALCOMBUSTION : any =  { type:3, value:'EXTERNALCOMBUSTION'}; static INTERNALCOMBUSTION : any =  { type:3, value:'INTERNALCOMBUSTION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcEvaporativeCoolerTypeEnum {
	static DIRECTEVAPORATIVEAIRWASHER : any =  { type:3, value:'DIRECTEVAPORATIVEAIRWASHER'}; static DIRECTEVAPORATIVEPACKAGEDROTARYAIRCOOLER : any =  { type:3, value:'DIRECTEVAPORATIVEPACKAGEDROTARYAIRCOOLER'}; static DIRECTEVAPORATIVERANDOMMEDIAAIRCOOLER : any =  { type:3, value:'DIRECTEVAPORATIVERANDOMMEDIAAIRCOOLER'}; static DIRECTEVAPORATIVERIGIDMEDIAAIRCOOLER : any =  { type:3, value:'DIRECTEVAPORATIVERIGIDMEDIAAIRCOOLER'}; static DIRECTEVAPORATIVESLINGERSPACKAGEDAIRCOOLER : any =  { type:3, value:'DIRECTEVAPORATIVESLINGERSPACKAGEDAIRCOOLER'}; static INDIRECTDIRECTCOMBINATION : any =  { type:3, value:'INDIRECTDIRECTCOMBINATION'}; static INDIRECTEVAPORATIVECOOLINGTOWERORCOILCOOLER : any =  { type:3, value:'INDIRECTEVAPORATIVECOOLINGTOWERORCOILCOOLER'}; static INDIRECTEVAPORATIVEPACKAGEAIRCOOLER : any =  { type:3, value:'INDIRECTEVAPORATIVEPACKAGEAIRCOOLER'}; static INDIRECTEVAPORATIVEWETCOIL : any =  { type:3, value:'INDIRECTEVAPORATIVEWETCOIL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcEvaporatorTypeEnum {
	static DIRECTEXPANSION : any =  { type:3, value:'DIRECTEXPANSION'}; static DIRECTEXPANSIONBRAZEDPLATE : any =  { type:3, value:'DIRECTEXPANSIONBRAZEDPLATE'}; static DIRECTEXPANSIONSHELLANDTUBE : any =  { type:3, value:'DIRECTEXPANSIONSHELLANDTUBE'}; static DIRECTEXPANSIONTUBEINTUBE : any =  { type:3, value:'DIRECTEXPANSIONTUBEINTUBE'}; static FLOODEDSHELLANDTUBE : any =  { type:3, value:'FLOODEDSHELLANDTUBE'}; static SHELLANDCOIL : any =  { type:3, value:'SHELLANDCOIL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcEventTriggerTypeEnum {
	static EVENTCOMPLEX : any =  { type:3, value:'EVENTCOMPLEX'}; static EVENTMESSAGE : any =  { type:3, value:'EVENTMESSAGE'}; static EVENTRULE : any =  { type:3, value:'EVENTRULE'}; static EVENTTIME : any =  { type:3, value:'EVENTTIME'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcEventTypeEnum {
	static ENDEVENT : any =  { type:3, value:'ENDEVENT'}; static INTERMEDIATEEVENT : any =  { type:3, value:'INTERMEDIATEEVENT'}; static STARTEVENT : any =  { type:3, value:'STARTEVENT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcExternalSpatialElementTypeEnum {
	static EXTERNAL : any =  { type:3, value:'EXTERNAL'}; static EXTERNAL_EARTH : any =  { type:3, value:'EXTERNAL_EARTH'}; static EXTERNAL_FIRE : any =  { type:3, value:'EXTERNAL_FIRE'}; static EXTERNAL_WATER : any =  { type:3, value:'EXTERNAL_WATER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcFacilityPartCommonTypeEnum {
	static ABOVEGROUND : any =  { type:3, value:'ABOVEGROUND'}; static BELOWGROUND : any =  { type:3, value:'BELOWGROUND'}; static JUNCTION : any =  { type:3, value:'JUNCTION'}; static LEVELCROSSING : any =  { type:3, value:'LEVELCROSSING'}; static SEGMENT : any =  { type:3, value:'SEGMENT'}; static SUBSTRUCTURE : any =  { type:3, value:'SUBSTRUCTURE'}; static SUPERSTRUCTURE : any =  { type:3, value:'SUPERSTRUCTURE'}; static TERMINAL : any =  { type:3, value:'TERMINAL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcFacilityUsageEnum {
	static LATERAL : any =  { type:3, value:'LATERAL'}; static LONGITUDINAL : any =  { type:3, value:'LONGITUDINAL'}; static REGION : any =  { type:3, value:'REGION'}; static VERTICAL : any =  { type:3, value:'VERTICAL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcFanTypeEnum {
	static CENTRIFUGALAIRFOIL : any =  { type:3, value:'CENTRIFUGALAIRFOIL'}; static CENTRIFUGALBACKWARDINCLINEDCURVED : any =  { type:3, value:'CENTRIFUGALBACKWARDINCLINEDCURVED'}; static CENTRIFUGALFORWARDCURVED : any =  { type:3, value:'CENTRIFUGALFORWARDCURVED'}; static CENTRIFUGALRADIAL : any =  { type:3, value:'CENTRIFUGALRADIAL'}; static PROPELLORAXIAL : any =  { type:3, value:'PROPELLORAXIAL'}; static TUBEAXIAL : any =  { type:3, value:'TUBEAXIAL'}; static VANEAXIAL : any =  { type:3, value:'VANEAXIAL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcFastenerTypeEnum {
	static GLUE : any =  { type:3, value:'GLUE'}; static MORTAR : any =  { type:3, value:'MORTAR'}; static WELD : any =  { type:3, value:'WELD'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcFilterTypeEnum {
	static AIRPARTICLEFILTER : any =  { type:3, value:'AIRPARTICLEFILTER'}; static COMPRESSEDAIRFILTER : any =  { type:3, value:'COMPRESSEDAIRFILTER'}; static ODORFILTER : any =  { type:3, value:'ODORFILTER'}; static OILFILTER : any =  { type:3, value:'OILFILTER'}; static STRAINER : any =  { type:3, value:'STRAINER'}; static WATERFILTER : any =  { type:3, value:'WATERFILTER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcFireSuppressionTerminalTypeEnum {
	static BREECHINGINLET : any =  { type:3, value:'BREECHINGINLET'}; static FIREHYDRANT : any =  { type:3, value:'FIREHYDRANT'}; static FIREMONITOR : any =  { type:3, value:'FIREMONITOR'}; static HOSEREEL : any =  { type:3, value:'HOSEREEL'}; static SPRINKLER : any =  { type:3, value:'SPRINKLER'}; static SPRINKLERDEFLECTOR : any =  { type:3, value:'SPRINKLERDEFLECTOR'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcFlowDirectionEnum {
	static SINK : any =  { type:3, value:'SINK'}; static SOURCE : any =  { type:3, value:'SOURCE'}; static SOURCEANDSINK : any =  { type:3, value:'SOURCEANDSINK'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcFlowInstrumentTypeEnum {
	static AMMETER : any =  { type:3, value:'AMMETER'}; static COMBINED : any =  { type:3, value:'COMBINED'}; static FREQUENCYMETER : any =  { type:3, value:'FREQUENCYMETER'}; static PHASEANGLEMETER : any =  { type:3, value:'PHASEANGLEMETER'}; static POWERFACTORMETER : any =  { type:3, value:'POWERFACTORMETER'}; static PRESSUREGAUGE : any =  { type:3, value:'PRESSUREGAUGE'}; static THERMOMETER : any =  { type:3, value:'THERMOMETER'}; static VOLTMETER : any =  { type:3, value:'VOLTMETER'}; static VOLTMETER_PEAK : any =  { type:3, value:'VOLTMETER_PEAK'}; static VOLTMETER_RMS : any =  { type:3, value:'VOLTMETER_RMS'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcFlowMeterTypeEnum {
	static ENERGYMETER : any =  { type:3, value:'ENERGYMETER'}; static GASMETER : any =  { type:3, value:'GASMETER'}; static OILMETER : any =  { type:3, value:'OILMETER'}; static WATERMETER : any =  { type:3, value:'WATERMETER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcFootingTypeEnum {
	static CAISSON_FOUNDATION : any =  { type:3, value:'CAISSON_FOUNDATION'}; static FOOTING_BEAM : any =  { type:3, value:'FOOTING_BEAM'}; static PAD_FOOTING : any =  { type:3, value:'PAD_FOOTING'}; static PILE_CAP : any =  { type:3, value:'PILE_CAP'}; static STRIP_FOOTING : any =  { type:3, value:'STRIP_FOOTING'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcFurnitureTypeEnum {
	static BED : any =  { type:3, value:'BED'}; static CHAIR : any =  { type:3, value:'CHAIR'}; static DESK : any =  { type:3, value:'DESK'}; static FILECABINET : any =  { type:3, value:'FILECABINET'}; static SHELF : any =  { type:3, value:'SHELF'}; static SOFA : any =  { type:3, value:'SOFA'}; static TABLE : any =  { type:3, value:'TABLE'}; static TECHNICALCABINET : any =  { type:3, value:'TECHNICALCABINET'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcGeographicElementTypeEnum {
	static SOIL_BORING_POINT : any =  { type:3, value:'SOIL_BORING_POINT'}; static TERRAIN : any =  { type:3, value:'TERRAIN'}; static VEGETATION : any =  { type:3, value:'VEGETATION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcGeometricProjectionEnum {
	static ELEVATION_VIEW : any =  { type:3, value:'ELEVATION_VIEW'}; static GRAPH_VIEW : any =  { type:3, value:'GRAPH_VIEW'}; static MODEL_VIEW : any =  { type:3, value:'MODEL_VIEW'}; static PLAN_VIEW : any =  { type:3, value:'PLAN_VIEW'}; static REFLECTED_PLAN_VIEW : any =  { type:3, value:'REFLECTED_PLAN_VIEW'}; static SECTION_VIEW : any =  { type:3, value:'SECTION_VIEW'}; static SKETCH_VIEW : any =  { type:3, value:'SKETCH_VIEW'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcGeotechnicalStratumTypeEnum {
	static SOLID : any =  { type:3, value:'SOLID'}; static VOID : any =  { type:3, value:'VOID'}; static WATER : any =  { type:3, value:'WATER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcGlobalOrLocalEnum {
	static GLOBAL_COORDS : any =  { type:3, value:'GLOBAL_COORDS'}; static LOCAL_COORDS : any =  { type:3, value:'LOCAL_COORDS'}; 
}
export class IfcGridTypeEnum {
	static IRREGULAR : any =  { type:3, value:'IRREGULAR'}; static RADIAL : any =  { type:3, value:'RADIAL'}; static RECTANGULAR : any =  { type:3, value:'RECTANGULAR'}; static TRIANGULAR : any =  { type:3, value:'TRIANGULAR'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcHeatExchangerTypeEnum {
	static PLATE : any =  { type:3, value:'PLATE'}; static SHELLANDTUBE : any =  { type:3, value:'SHELLANDTUBE'}; static TURNOUTHEATING : any =  { type:3, value:'TURNOUTHEATING'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcHumidifierTypeEnum {
	static ADIABATICAIRWASHER : any =  { type:3, value:'ADIABATICAIRWASHER'}; static ADIABATICATOMIZING : any =  { type:3, value:'ADIABATICATOMIZING'}; static ADIABATICCOMPRESSEDAIRNOZZLE : any =  { type:3, value:'ADIABATICCOMPRESSEDAIRNOZZLE'}; static ADIABATICPAN : any =  { type:3, value:'ADIABATICPAN'}; static ADIABATICRIGIDMEDIA : any =  { type:3, value:'ADIABATICRIGIDMEDIA'}; static ADIABATICULTRASONIC : any =  { type:3, value:'ADIABATICULTRASONIC'}; static ADIABATICWETTEDELEMENT : any =  { type:3, value:'ADIABATICWETTEDELEMENT'}; static ASSISTEDBUTANE : any =  { type:3, value:'ASSISTEDBUTANE'}; static ASSISTEDELECTRIC : any =  { type:3, value:'ASSISTEDELECTRIC'}; static ASSISTEDNATURALGAS : any =  { type:3, value:'ASSISTEDNATURALGAS'}; static ASSISTEDPROPANE : any =  { type:3, value:'ASSISTEDPROPANE'}; static ASSISTEDSTEAM : any =  { type:3, value:'ASSISTEDSTEAM'}; static STEAMINJECTION : any =  { type:3, value:'STEAMINJECTION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcImpactProtectionDeviceTypeEnum {
	static BUMPER : any =  { type:3, value:'BUMPER'}; static CRASHCUSHION : any =  { type:3, value:'CRASHCUSHION'}; static DAMPINGSYSTEM : any =  { type:3, value:'DAMPINGSYSTEM'}; static FENDER : any =  { type:3, value:'FENDER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcInterceptorTypeEnum {
	static CYCLONIC : any =  { type:3, value:'CYCLONIC'}; static GREASE : any =  { type:3, value:'GREASE'}; static OIL : any =  { type:3, value:'OIL'}; static PETROL : any =  { type:3, value:'PETROL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcInternalOrExternalEnum {
	static EXTERNAL : any =  { type:3, value:'EXTERNAL'}; static EXTERNAL_EARTH : any =  { type:3, value:'EXTERNAL_EARTH'}; static EXTERNAL_FIRE : any =  { type:3, value:'EXTERNAL_FIRE'}; static EXTERNAL_WATER : any =  { type:3, value:'EXTERNAL_WATER'}; static INTERNAL : any =  { type:3, value:'INTERNAL'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcInventoryTypeEnum {
	static ASSETINVENTORY : any =  { type:3, value:'ASSETINVENTORY'}; static FURNITUREINVENTORY : any =  { type:3, value:'FURNITUREINVENTORY'}; static SPACEINVENTORY : any =  { type:3, value:'SPACEINVENTORY'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcJunctionBoxTypeEnum {
	static DATA : any =  { type:3, value:'DATA'}; static POWER : any =  { type:3, value:'POWER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcKnotType {
	static PIECEWISE_BEZIER_KNOTS : any =  { type:3, value:'PIECEWISE_BEZIER_KNOTS'}; static QUASI_UNIFORM_KNOTS : any =  { type:3, value:'QUASI_UNIFORM_KNOTS'}; static UNIFORM_KNOTS : any =  { type:3, value:'UNIFORM_KNOTS'}; static UNSPECIFIED : any =  { type:3, value:'UNSPECIFIED'}; 
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
	static DIRECTIONSOURCE : any =  { type:3, value:'DIRECTIONSOURCE'}; static POINTSOURCE : any =  { type:3, value:'POINTSOURCE'}; static SECURITYLIGHTING : any =  { type:3, value:'SECURITYLIGHTING'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcLiquidTerminalTypeEnum {
	static HOSEREEL : any =  { type:3, value:'HOSEREEL'}; static LOADINGARM : any =  { type:3, value:'LOADINGARM'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcLoadGroupTypeEnum {
	static LOAD_CASE : any =  { type:3, value:'LOAD_CASE'}; static LOAD_COMBINATION : any =  { type:3, value:'LOAD_COMBINATION'}; static LOAD_GROUP : any =  { type:3, value:'LOAD_GROUP'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcLogicalOperatorEnum {
	static LOGICALAND : any =  { type:3, value:'LOGICALAND'}; static LOGICALNOTAND : any =  { type:3, value:'LOGICALNOTAND'}; static LOGICALNOTOR : any =  { type:3, value:'LOGICALNOTOR'}; static LOGICALOR : any =  { type:3, value:'LOGICALOR'}; static LOGICALXOR : any =  { type:3, value:'LOGICALXOR'}; 
}
export class IfcMarineFacilityTypeEnum {
	static BARRIERBEACH : any =  { type:3, value:'BARRIERBEACH'}; static BREAKWATER : any =  { type:3, value:'BREAKWATER'}; static CANAL : any =  { type:3, value:'CANAL'}; static DRYDOCK : any =  { type:3, value:'DRYDOCK'}; static FLOATINGDOCK : any =  { type:3, value:'FLOATINGDOCK'}; static HYDROLIFT : any =  { type:3, value:'HYDROLIFT'}; static JETTY : any =  { type:3, value:'JETTY'}; static LAUNCHRECOVERY : any =  { type:3, value:'LAUNCHRECOVERY'}; static MARINEDEFENCE : any =  { type:3, value:'MARINEDEFENCE'}; static NAVIGATIONALCHANNEL : any =  { type:3, value:'NAVIGATIONALCHANNEL'}; static PORT : any =  { type:3, value:'PORT'}; static QUAY : any =  { type:3, value:'QUAY'}; static REVETMENT : any =  { type:3, value:'REVETMENT'}; static SHIPLIFT : any =  { type:3, value:'SHIPLIFT'}; static SHIPLOCK : any =  { type:3, value:'SHIPLOCK'}; static SHIPYARD : any =  { type:3, value:'SHIPYARD'}; static SLIPWAY : any =  { type:3, value:'SLIPWAY'}; static WATERWAY : any =  { type:3, value:'WATERWAY'}; static WATERWAYSHIPLIFT : any =  { type:3, value:'WATERWAYSHIPLIFT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcMarinePartTypeEnum {
	static ABOVEWATERLINE : any =  { type:3, value:'ABOVEWATERLINE'}; static ANCHORAGE : any =  { type:3, value:'ANCHORAGE'}; static APPROACHCHANNEL : any =  { type:3, value:'APPROACHCHANNEL'}; static BELOWWATERLINE : any =  { type:3, value:'BELOWWATERLINE'}; static BERTHINGSTRUCTURE : any =  { type:3, value:'BERTHINGSTRUCTURE'}; static CHAMBER : any =  { type:3, value:'CHAMBER'}; static CILL_LEVEL : any =  { type:3, value:'CILL_LEVEL'}; static COPELEVEL : any =  { type:3, value:'COPELEVEL'}; static CORE : any =  { type:3, value:'CORE'}; static CREST : any =  { type:3, value:'CREST'}; static GATEHEAD : any =  { type:3, value:'GATEHEAD'}; static GUDINGSTRUCTURE : any =  { type:3, value:'GUDINGSTRUCTURE'}; static HIGHWATERLINE : any =  { type:3, value:'HIGHWATERLINE'}; static LANDFIELD : any =  { type:3, value:'LANDFIELD'}; static LEEWARDSIDE : any =  { type:3, value:'LEEWARDSIDE'}; static LOWWATERLINE : any =  { type:3, value:'LOWWATERLINE'}; static MANUFACTURING : any =  { type:3, value:'MANUFACTURING'}; static NAVIGATIONALAREA : any =  { type:3, value:'NAVIGATIONALAREA'}; static PROTECTION : any =  { type:3, value:'PROTECTION'}; static SHIPTRANSFER : any =  { type:3, value:'SHIPTRANSFER'}; static STORAGEAREA : any =  { type:3, value:'STORAGEAREA'}; static VEHICLESERVICING : any =  { type:3, value:'VEHICLESERVICING'}; static WATERFIELD : any =  { type:3, value:'WATERFIELD'}; static WEATHERSIDE : any =  { type:3, value:'WEATHERSIDE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcMechanicalFastenerTypeEnum {
	static ANCHORBOLT : any =  { type:3, value:'ANCHORBOLT'}; static BOLT : any =  { type:3, value:'BOLT'}; static CHAIN : any =  { type:3, value:'CHAIN'}; static COUPLER : any =  { type:3, value:'COUPLER'}; static DOWEL : any =  { type:3, value:'DOWEL'}; static NAIL : any =  { type:3, value:'NAIL'}; static NAILPLATE : any =  { type:3, value:'NAILPLATE'}; static RAILFASTENING : any =  { type:3, value:'RAILFASTENING'}; static RAILJOINT : any =  { type:3, value:'RAILJOINT'}; static RIVET : any =  { type:3, value:'RIVET'}; static ROPE : any =  { type:3, value:'ROPE'}; static SCREW : any =  { type:3, value:'SCREW'}; static SHEARCONNECTOR : any =  { type:3, value:'SHEARCONNECTOR'}; static STAPLE : any =  { type:3, value:'STAPLE'}; static STUDSHEARCONNECTOR : any =  { type:3, value:'STUDSHEARCONNECTOR'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcMedicalDeviceTypeEnum {
	static AIRSTATION : any =  { type:3, value:'AIRSTATION'}; static FEEDAIRUNIT : any =  { type:3, value:'FEEDAIRUNIT'}; static OXYGENGENERATOR : any =  { type:3, value:'OXYGENGENERATOR'}; static OXYGENPLANT : any =  { type:3, value:'OXYGENPLANT'}; static VACUUMSTATION : any =  { type:3, value:'VACUUMSTATION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcMemberTypeEnum {
	static ARCH_SEGMENT : any =  { type:3, value:'ARCH_SEGMENT'}; static BRACE : any =  { type:3, value:'BRACE'}; static CHORD : any =  { type:3, value:'CHORD'}; static COLLAR : any =  { type:3, value:'COLLAR'}; static MEMBER : any =  { type:3, value:'MEMBER'}; static MULLION : any =  { type:3, value:'MULLION'}; static PLATE : any =  { type:3, value:'PLATE'}; static POST : any =  { type:3, value:'POST'}; static PURLIN : any =  { type:3, value:'PURLIN'}; static RAFTER : any =  { type:3, value:'RAFTER'}; static STAY_CABLE : any =  { type:3, value:'STAY_CABLE'}; static STIFFENING_RIB : any =  { type:3, value:'STIFFENING_RIB'}; static STRINGER : any =  { type:3, value:'STRINGER'}; static STRUCTURALCABLE : any =  { type:3, value:'STRUCTURALCABLE'}; static STRUT : any =  { type:3, value:'STRUT'}; static STUD : any =  { type:3, value:'STUD'}; static SUSPENDER : any =  { type:3, value:'SUSPENDER'}; static SUSPENSION_CABLE : any =  { type:3, value:'SUSPENSION_CABLE'}; static TIEBAR : any =  { type:3, value:'TIEBAR'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcMobileTelecommunicationsApplianceTypeEnum {
	static ACCESSPOINT : any =  { type:3, value:'ACCESSPOINT'}; static BASEBANDUNIT : any =  { type:3, value:'BASEBANDUNIT'}; static BASETRANSCEIVERSTATION : any =  { type:3, value:'BASETRANSCEIVERSTATION'}; static E_UTRAN_NODE_B : any =  { type:3, value:'E_UTRAN_NODE_B'}; static GATEWAY_GPRS_SUPPORT_NODE : any =  { type:3, value:'GATEWAY_GPRS_SUPPORT_NODE'}; static MASTERUNIT : any =  { type:3, value:'MASTERUNIT'}; static MOBILESWITCHINGCENTER : any =  { type:3, value:'MOBILESWITCHINGCENTER'}; static MSCSERVER : any =  { type:3, value:'MSCSERVER'}; static PACKETCONTROLUNIT : any =  { type:3, value:'PACKETCONTROLUNIT'}; static REMOTERADIOUNIT : any =  { type:3, value:'REMOTERADIOUNIT'}; static REMOTEUNIT : any =  { type:3, value:'REMOTEUNIT'}; static SERVICE_GPRS_SUPPORT_NODE : any =  { type:3, value:'SERVICE_GPRS_SUPPORT_NODE'}; static SUBSCRIBERSERVER : any =  { type:3, value:'SUBSCRIBERSERVER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcMooringDeviceTypeEnum {
	static BOLLARD : any =  { type:3, value:'BOLLARD'}; static LINETENSIONER : any =  { type:3, value:'LINETENSIONER'}; static MAGNETICDEVICE : any =  { type:3, value:'MAGNETICDEVICE'}; static MOORINGHOOKS : any =  { type:3, value:'MOORINGHOOKS'}; static VACUUMDEVICE : any =  { type:3, value:'VACUUMDEVICE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcMotorConnectionTypeEnum {
	static BELTDRIVE : any =  { type:3, value:'BELTDRIVE'}; static COUPLING : any =  { type:3, value:'COUPLING'}; static DIRECTDRIVE : any =  { type:3, value:'DIRECTDRIVE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcNavigationElementTypeEnum {
	static BEACON : any =  { type:3, value:'BEACON'}; static BUOY : any =  { type:3, value:'BUOY'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcObjectTypeEnum {
	static ACTOR : any =  { type:3, value:'ACTOR'}; static CONTROL : any =  { type:3, value:'CONTROL'}; static GROUP : any =  { type:3, value:'GROUP'}; static PROCESS : any =  { type:3, value:'PROCESS'}; static PRODUCT : any =  { type:3, value:'PRODUCT'}; static PROJECT : any =  { type:3, value:'PROJECT'}; static RESOURCE : any =  { type:3, value:'RESOURCE'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
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
	static AUDIOVISUALOUTLET : any =  { type:3, value:'AUDIOVISUALOUTLET'}; static COMMUNICATIONSOUTLET : any =  { type:3, value:'COMMUNICATIONSOUTLET'}; static DATAOUTLET : any =  { type:3, value:'DATAOUTLET'}; static POWEROUTLET : any =  { type:3, value:'POWEROUTLET'}; static TELEPHONEOUTLET : any =  { type:3, value:'TELEPHONEOUTLET'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPavementTypeEnum {
	static FLEXIBLE : any =  { type:3, value:'FLEXIBLE'}; static RIGID : any =  { type:3, value:'RIGID'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
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
	static BORED : any =  { type:3, value:'BORED'}; static COHESION : any =  { type:3, value:'COHESION'}; static DRIVEN : any =  { type:3, value:'DRIVEN'}; static FRICTION : any =  { type:3, value:'FRICTION'}; static JETGROUTING : any =  { type:3, value:'JETGROUTING'}; static SUPPORT : any =  { type:3, value:'SUPPORT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPipeFittingTypeEnum {
	static BEND : any =  { type:3, value:'BEND'}; static CONNECTOR : any =  { type:3, value:'CONNECTOR'}; static ENTRY : any =  { type:3, value:'ENTRY'}; static EXIT : any =  { type:3, value:'EXIT'}; static JUNCTION : any =  { type:3, value:'JUNCTION'}; static OBSTRUCTION : any =  { type:3, value:'OBSTRUCTION'}; static TRANSITION : any =  { type:3, value:'TRANSITION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPipeSegmentTypeEnum {
	static CULVERT : any =  { type:3, value:'CULVERT'}; static FLEXIBLESEGMENT : any =  { type:3, value:'FLEXIBLESEGMENT'}; static GUTTER : any =  { type:3, value:'GUTTER'}; static RIGIDSEGMENT : any =  { type:3, value:'RIGIDSEGMENT'}; static SPOOL : any =  { type:3, value:'SPOOL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPlateTypeEnum {
	static BASE_PLATE : any =  { type:3, value:'BASE_PLATE'}; static COVER_PLATE : any =  { type:3, value:'COVER_PLATE'}; static CURTAIN_PANEL : any =  { type:3, value:'CURTAIN_PANEL'}; static FLANGE_PLATE : any =  { type:3, value:'FLANGE_PLATE'}; static GUSSET_PLATE : any =  { type:3, value:'GUSSET_PLATE'}; static SHEET : any =  { type:3, value:'SHEET'}; static SPLICE_PLATE : any =  { type:3, value:'SPLICE_PLATE'}; static STIFFENER_PLATE : any =  { type:3, value:'STIFFENER_PLATE'}; static WEB_PLATE : any =  { type:3, value:'WEB_PLATE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPreferredSurfaceCurveRepresentation {
	static CURVE3D : any =  { type:3, value:'CURVE3D'}; static PCURVE_S1 : any =  { type:3, value:'PCURVE_S1'}; static PCURVE_S2 : any =  { type:3, value:'PCURVE_S2'}; 
}
export class IfcProcedureTypeEnum {
	static ADVICE_CAUTION : any =  { type:3, value:'ADVICE_CAUTION'}; static ADVICE_NOTE : any =  { type:3, value:'ADVICE_NOTE'}; static ADVICE_WARNING : any =  { type:3, value:'ADVICE_WARNING'}; static CALIBRATION : any =  { type:3, value:'CALIBRATION'}; static DIAGNOSTIC : any =  { type:3, value:'DIAGNOSTIC'}; static SHUTDOWN : any =  { type:3, value:'SHUTDOWN'}; static STARTUP : any =  { type:3, value:'STARTUP'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcProfileTypeEnum {
	static AREA : any =  { type:3, value:'AREA'}; static CURVE : any =  { type:3, value:'CURVE'}; 
}
export class IfcProjectOrderTypeEnum {
	static CHANGEORDER : any =  { type:3, value:'CHANGEORDER'}; static MAINTENANCEWORKORDER : any =  { type:3, value:'MAINTENANCEWORKORDER'}; static MOVEORDER : any =  { type:3, value:'MOVEORDER'}; static PURCHASEORDER : any =  { type:3, value:'PURCHASEORDER'}; static WORKORDER : any =  { type:3, value:'WORKORDER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcProjectedOrTrueLengthEnum {
	static PROJECTED_LENGTH : any =  { type:3, value:'PROJECTED_LENGTH'}; static TRUE_LENGTH : any =  { type:3, value:'TRUE_LENGTH'}; 
}
export class IfcProjectionElementTypeEnum {
	static BLISTER : any =  { type:3, value:'BLISTER'}; static DEVIATOR : any =  { type:3, value:'DEVIATOR'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPropertySetTemplateTypeEnum {
	static PSET_MATERIALDRIVEN : any =  { type:3, value:'PSET_MATERIALDRIVEN'}; static PSET_OCCURRENCEDRIVEN : any =  { type:3, value:'PSET_OCCURRENCEDRIVEN'}; static PSET_PERFORMANCEDRIVEN : any =  { type:3, value:'PSET_PERFORMANCEDRIVEN'}; static PSET_PROFILEDRIVEN : any =  { type:3, value:'PSET_PROFILEDRIVEN'}; static PSET_TYPEDRIVENONLY : any =  { type:3, value:'PSET_TYPEDRIVENONLY'}; static PSET_TYPEDRIVENOVERRIDE : any =  { type:3, value:'PSET_TYPEDRIVENOVERRIDE'}; static QTO_OCCURRENCEDRIVEN : any =  { type:3, value:'QTO_OCCURRENCEDRIVEN'}; static QTO_TYPEDRIVENONLY : any =  { type:3, value:'QTO_TYPEDRIVENONLY'}; static QTO_TYPEDRIVENOVERRIDE : any =  { type:3, value:'QTO_TYPEDRIVENOVERRIDE'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcProtectiveDeviceTrippingUnitTypeEnum {
	static ELECTROMAGNETIC : any =  { type:3, value:'ELECTROMAGNETIC'}; static ELECTRONIC : any =  { type:3, value:'ELECTRONIC'}; static RESIDUALCURRENT : any =  { type:3, value:'RESIDUALCURRENT'}; static THERMAL : any =  { type:3, value:'THERMAL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcProtectiveDeviceTypeEnum {
	static ANTI_ARCING_DEVICE : any =  { type:3, value:'ANTI_ARCING_DEVICE'}; static CIRCUITBREAKER : any =  { type:3, value:'CIRCUITBREAKER'}; static EARTHINGSWITCH : any =  { type:3, value:'EARTHINGSWITCH'}; static EARTHLEAKAGECIRCUITBREAKER : any =  { type:3, value:'EARTHLEAKAGECIRCUITBREAKER'}; static FUSEDISCONNECTOR : any =  { type:3, value:'FUSEDISCONNECTOR'}; static RESIDUALCURRENTCIRCUITBREAKER : any =  { type:3, value:'RESIDUALCURRENTCIRCUITBREAKER'}; static RESIDUALCURRENTSWITCH : any =  { type:3, value:'RESIDUALCURRENTSWITCH'}; static SPARKGAP : any =  { type:3, value:'SPARKGAP'}; static VARISTOR : any =  { type:3, value:'VARISTOR'}; static VOLTAGELIMITER : any =  { type:3, value:'VOLTAGELIMITER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcPumpTypeEnum {
	static CIRCULATOR : any =  { type:3, value:'CIRCULATOR'}; static ENDSUCTION : any =  { type:3, value:'ENDSUCTION'}; static SPLITCASE : any =  { type:3, value:'SPLITCASE'}; static SUBMERSIBLEPUMP : any =  { type:3, value:'SUBMERSIBLEPUMP'}; static SUMPPUMP : any =  { type:3, value:'SUMPPUMP'}; static VERTICALINLINE : any =  { type:3, value:'VERTICALINLINE'}; static VERTICALTURBINE : any =  { type:3, value:'VERTICALTURBINE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcRailTypeEnum {
	static BLADE : any =  { type:3, value:'BLADE'}; static CHECKRAIL : any =  { type:3, value:'CHECKRAIL'}; static GUARDRAIL : any =  { type:3, value:'GUARDRAIL'}; static RACKRAIL : any =  { type:3, value:'RACKRAIL'}; static RAIL : any =  { type:3, value:'RAIL'}; static STOCKRAIL : any =  { type:3, value:'STOCKRAIL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcRailingTypeEnum {
	static BALUSTRADE : any =  { type:3, value:'BALUSTRADE'}; static FENCE : any =  { type:3, value:'FENCE'}; static GUARDRAIL : any =  { type:3, value:'GUARDRAIL'}; static HANDRAIL : any =  { type:3, value:'HANDRAIL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcRailwayPartTypeEnum {
	static DILATATIONSUPERSTRUCTURE : any =  { type:3, value:'DILATATIONSUPERSTRUCTURE'}; static LINESIDESTRUCTURE : any =  { type:3, value:'LINESIDESTRUCTURE'}; static LINESIDESTRUCTUREPART : any =  { type:3, value:'LINESIDESTRUCTUREPART'}; static PLAINTRACKSUPERSTRUCTURE : any =  { type:3, value:'PLAINTRACKSUPERSTRUCTURE'}; static SUPERSTRUCTURE : any =  { type:3, value:'SUPERSTRUCTURE'}; static TRACKSTRUCTURE : any =  { type:3, value:'TRACKSTRUCTURE'}; static TRACKSTRUCTUREPART : any =  { type:3, value:'TRACKSTRUCTUREPART'}; static TURNOUTSUPERSTRUCTURE : any =  { type:3, value:'TURNOUTSUPERSTRUCTURE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcRailwayTypeEnum {
	static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcRampFlightTypeEnum {
	static SPIRAL : any =  { type:3, value:'SPIRAL'}; static STRAIGHT : any =  { type:3, value:'STRAIGHT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcRampTypeEnum {
	static HALF_TURN_RAMP : any =  { type:3, value:'HALF_TURN_RAMP'}; static QUARTER_TURN_RAMP : any =  { type:3, value:'QUARTER_TURN_RAMP'}; static SPIRAL_RAMP : any =  { type:3, value:'SPIRAL_RAMP'}; static STRAIGHT_RUN_RAMP : any =  { type:3, value:'STRAIGHT_RUN_RAMP'}; static TWO_QUARTER_TURN_RAMP : any =  { type:3, value:'TWO_QUARTER_TURN_RAMP'}; static TWO_STRAIGHT_RUN_RAMP : any =  { type:3, value:'TWO_STRAIGHT_RUN_RAMP'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcRecurrenceTypeEnum {
	static BY_DAY_COUNT : any =  { type:3, value:'BY_DAY_COUNT'}; static BY_WEEKDAY_COUNT : any =  { type:3, value:'BY_WEEKDAY_COUNT'}; static DAILY : any =  { type:3, value:'DAILY'}; static MONTHLY_BY_DAY_OF_MONTH : any =  { type:3, value:'MONTHLY_BY_DAY_OF_MONTH'}; static MONTHLY_BY_POSITION : any =  { type:3, value:'MONTHLY_BY_POSITION'}; static WEEKLY : any =  { type:3, value:'WEEKLY'}; static YEARLY_BY_DAY_OF_MONTH : any =  { type:3, value:'YEARLY_BY_DAY_OF_MONTH'}; static YEARLY_BY_POSITION : any =  { type:3, value:'YEARLY_BY_POSITION'}; 
}
export class IfcReferentTypeEnum {
	static BOUNDARY : any =  { type:3, value:'BOUNDARY'}; static INTERSECTION : any =  { type:3, value:'INTERSECTION'}; static KILOPOINT : any =  { type:3, value:'KILOPOINT'}; static LANDMARK : any =  { type:3, value:'LANDMARK'}; static MILEPOINT : any =  { type:3, value:'MILEPOINT'}; static POSITION : any =  { type:3, value:'POSITION'}; static REFERENCEMARKER : any =  { type:3, value:'REFERENCEMARKER'}; static STATION : any =  { type:3, value:'STATION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcReflectanceMethodEnum {
	static BLINN : any =  { type:3, value:'BLINN'}; static FLAT : any =  { type:3, value:'FLAT'}; static GLASS : any =  { type:3, value:'GLASS'}; static MATT : any =  { type:3, value:'MATT'}; static METAL : any =  { type:3, value:'METAL'}; static MIRROR : any =  { type:3, value:'MIRROR'}; static PHONG : any =  { type:3, value:'PHONG'}; static PHYSICAL : any =  { type:3, value:'PHYSICAL'}; static PLASTIC : any =  { type:3, value:'PLASTIC'}; static STRAUSS : any =  { type:3, value:'STRAUSS'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcReinforcedSoilTypeEnum {
	static DYNAMICALLYCOMPACTED : any =  { type:3, value:'DYNAMICALLYCOMPACTED'}; static GROUTED : any =  { type:3, value:'GROUTED'}; static REPLACED : any =  { type:3, value:'REPLACED'}; static ROLLERCOMPACTED : any =  { type:3, value:'ROLLERCOMPACTED'}; static SURCHARGEPRELOADED : any =  { type:3, value:'SURCHARGEPRELOADED'}; static VERTICALLYDRAINED : any =  { type:3, value:'VERTICALLYDRAINED'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcReinforcingBarRoleEnum {
	static ANCHORING : any =  { type:3, value:'ANCHORING'}; static EDGE : any =  { type:3, value:'EDGE'}; static LIGATURE : any =  { type:3, value:'LIGATURE'}; static MAIN : any =  { type:3, value:'MAIN'}; static PUNCHING : any =  { type:3, value:'PUNCHING'}; static RING : any =  { type:3, value:'RING'}; static SHEAR : any =  { type:3, value:'SHEAR'}; static STUD : any =  { type:3, value:'STUD'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcReinforcingBarSurfaceEnum {
	static PLAIN : any =  { type:3, value:'PLAIN'}; static TEXTURED : any =  { type:3, value:'TEXTURED'}; 
}
export class IfcReinforcingBarTypeEnum {
	static ANCHORING : any =  { type:3, value:'ANCHORING'}; static EDGE : any =  { type:3, value:'EDGE'}; static LIGATURE : any =  { type:3, value:'LIGATURE'}; static MAIN : any =  { type:3, value:'MAIN'}; static PUNCHING : any =  { type:3, value:'PUNCHING'}; static RING : any =  { type:3, value:'RING'}; static SHEAR : any =  { type:3, value:'SHEAR'}; static SPACEBAR : any =  { type:3, value:'SPACEBAR'}; static STUD : any =  { type:3, value:'STUD'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcReinforcingMeshTypeEnum {
	static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcRoadPartTypeEnum {
	static BICYCLECROSSING : any =  { type:3, value:'BICYCLECROSSING'}; static BUS_STOP : any =  { type:3, value:'BUS_STOP'}; static CARRIAGEWAY : any =  { type:3, value:'CARRIAGEWAY'}; static CENTRALISLAND : any =  { type:3, value:'CENTRALISLAND'}; static CENTRALRESERVE : any =  { type:3, value:'CENTRALRESERVE'}; static HARDSHOULDER : any =  { type:3, value:'HARDSHOULDER'}; static INTERSECTION : any =  { type:3, value:'INTERSECTION'}; static LAYBY : any =  { type:3, value:'LAYBY'}; static PARKINGBAY : any =  { type:3, value:'PARKINGBAY'}; static PASSINGBAY : any =  { type:3, value:'PASSINGBAY'}; static PEDESTRIAN_CROSSING : any =  { type:3, value:'PEDESTRIAN_CROSSING'}; static RAILWAYCROSSING : any =  { type:3, value:'RAILWAYCROSSING'}; static REFUGEISLAND : any =  { type:3, value:'REFUGEISLAND'}; static ROADSEGMENT : any =  { type:3, value:'ROADSEGMENT'}; static ROADSIDE : any =  { type:3, value:'ROADSIDE'}; static ROADSIDEPART : any =  { type:3, value:'ROADSIDEPART'}; static ROADWAYPLATEAU : any =  { type:3, value:'ROADWAYPLATEAU'}; static ROUNDABOUT : any =  { type:3, value:'ROUNDABOUT'}; static SHOULDER : any =  { type:3, value:'SHOULDER'}; static SIDEWALK : any =  { type:3, value:'SIDEWALK'}; static SOFTSHOULDER : any =  { type:3, value:'SOFTSHOULDER'}; static TOLLPLAZA : any =  { type:3, value:'TOLLPLAZA'}; static TRAFFICISLAND : any =  { type:3, value:'TRAFFICISLAND'}; static TRAFFICLANE : any =  { type:3, value:'TRAFFICLANE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcRoadTypeEnum {
	static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcRoleEnum {
	static ARCHITECT : any =  { type:3, value:'ARCHITECT'}; static BUILDINGOPERATOR : any =  { type:3, value:'BUILDINGOPERATOR'}; static BUILDINGOWNER : any =  { type:3, value:'BUILDINGOWNER'}; static CIVILENGINEER : any =  { type:3, value:'CIVILENGINEER'}; static CLIENT : any =  { type:3, value:'CLIENT'}; static COMMISSIONINGENGINEER : any =  { type:3, value:'COMMISSIONINGENGINEER'}; static CONSTRUCTIONMANAGER : any =  { type:3, value:'CONSTRUCTIONMANAGER'}; static CONSULTANT : any =  { type:3, value:'CONSULTANT'}; static CONTRACTOR : any =  { type:3, value:'CONTRACTOR'}; static COSTENGINEER : any =  { type:3, value:'COSTENGINEER'}; static ELECTRICALENGINEER : any =  { type:3, value:'ELECTRICALENGINEER'}; static ENGINEER : any =  { type:3, value:'ENGINEER'}; static FACILITIESMANAGER : any =  { type:3, value:'FACILITIESMANAGER'}; static FIELDCONSTRUCTIONMANAGER : any =  { type:3, value:'FIELDCONSTRUCTIONMANAGER'}; static MANUFACTURER : any =  { type:3, value:'MANUFACTURER'}; static MECHANICALENGINEER : any =  { type:3, value:'MECHANICALENGINEER'}; static OWNER : any =  { type:3, value:'OWNER'}; static PROJECTMANAGER : any =  { type:3, value:'PROJECTMANAGER'}; static RESELLER : any =  { type:3, value:'RESELLER'}; static STRUCTURALENGINEER : any =  { type:3, value:'STRUCTURALENGINEER'}; static SUBCONTRACTOR : any =  { type:3, value:'SUBCONTRACTOR'}; static SUPPLIER : any =  { type:3, value:'SUPPLIER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; 
}
export class IfcRoofTypeEnum {
	static BARREL_ROOF : any =  { type:3, value:'BARREL_ROOF'}; static BUTTERFLY_ROOF : any =  { type:3, value:'BUTTERFLY_ROOF'}; static DOME_ROOF : any =  { type:3, value:'DOME_ROOF'}; static FLAT_ROOF : any =  { type:3, value:'FLAT_ROOF'}; static FREEFORM : any =  { type:3, value:'FREEFORM'}; static GABLE_ROOF : any =  { type:3, value:'GABLE_ROOF'}; static GAMBREL_ROOF : any =  { type:3, value:'GAMBREL_ROOF'}; static HIPPED_GABLE_ROOF : any =  { type:3, value:'HIPPED_GABLE_ROOF'}; static HIP_ROOF : any =  { type:3, value:'HIP_ROOF'}; static MANSARD_ROOF : any =  { type:3, value:'MANSARD_ROOF'}; static PAVILION_ROOF : any =  { type:3, value:'PAVILION_ROOF'}; static RAINBOW_ROOF : any =  { type:3, value:'RAINBOW_ROOF'}; static SHED_ROOF : any =  { type:3, value:'SHED_ROOF'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSIPrefix {
	static ATTO : any =  { type:3, value:'ATTO'}; static CENTI : any =  { type:3, value:'CENTI'}; static DECA : any =  { type:3, value:'DECA'}; static DECI : any =  { type:3, value:'DECI'}; static EXA : any =  { type:3, value:'EXA'}; static FEMTO : any =  { type:3, value:'FEMTO'}; static GIGA : any =  { type:3, value:'GIGA'}; static HECTO : any =  { type:3, value:'HECTO'}; static KILO : any =  { type:3, value:'KILO'}; static MEGA : any =  { type:3, value:'MEGA'}; static MICRO : any =  { type:3, value:'MICRO'}; static MILLI : any =  { type:3, value:'MILLI'}; static NANO : any =  { type:3, value:'NANO'}; static PETA : any =  { type:3, value:'PETA'}; static PICO : any =  { type:3, value:'PICO'}; static TERA : any =  { type:3, value:'TERA'}; 
}
export class IfcSIUnitName {
	static AMPERE : any =  { type:3, value:'AMPERE'}; static BECQUEREL : any =  { type:3, value:'BECQUEREL'}; static CANDELA : any =  { type:3, value:'CANDELA'}; static COULOMB : any =  { type:3, value:'COULOMB'}; static CUBIC_METRE : any =  { type:3, value:'CUBIC_METRE'}; static DEGREE_CELSIUS : any =  { type:3, value:'DEGREE_CELSIUS'}; static FARAD : any =  { type:3, value:'FARAD'}; static GRAM : any =  { type:3, value:'GRAM'}; static GRAY : any =  { type:3, value:'GRAY'}; static HENRY : any =  { type:3, value:'HENRY'}; static HERTZ : any =  { type:3, value:'HERTZ'}; static JOULE : any =  { type:3, value:'JOULE'}; static KELVIN : any =  { type:3, value:'KELVIN'}; static LUMEN : any =  { type:3, value:'LUMEN'}; static LUX : any =  { type:3, value:'LUX'}; static METRE : any =  { type:3, value:'METRE'}; static MOLE : any =  { type:3, value:'MOLE'}; static NEWTON : any =  { type:3, value:'NEWTON'}; static OHM : any =  { type:3, value:'OHM'}; static PASCAL : any =  { type:3, value:'PASCAL'}; static RADIAN : any =  { type:3, value:'RADIAN'}; static SECOND : any =  { type:3, value:'SECOND'}; static SIEMENS : any =  { type:3, value:'SIEMENS'}; static SIEVERT : any =  { type:3, value:'SIEVERT'}; static SQUARE_METRE : any =  { type:3, value:'SQUARE_METRE'}; static STERADIAN : any =  { type:3, value:'STERADIAN'}; static TESLA : any =  { type:3, value:'TESLA'}; static VOLT : any =  { type:3, value:'VOLT'}; static WATT : any =  { type:3, value:'WATT'}; static WEBER : any =  { type:3, value:'WEBER'}; 
}
export class IfcSanitaryTerminalTypeEnum {
	static BATH : any =  { type:3, value:'BATH'}; static BIDET : any =  { type:3, value:'BIDET'}; static CISTERN : any =  { type:3, value:'CISTERN'}; static SANITARYFOUNTAIN : any =  { type:3, value:'SANITARYFOUNTAIN'}; static SHOWER : any =  { type:3, value:'SHOWER'}; static SINK : any =  { type:3, value:'SINK'}; static TOILETPAN : any =  { type:3, value:'TOILETPAN'}; static URINAL : any =  { type:3, value:'URINAL'}; static WASHHANDBASIN : any =  { type:3, value:'WASHHANDBASIN'}; static WCSEAT : any =  { type:3, value:'WCSEAT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSectionTypeEnum {
	static TAPERED : any =  { type:3, value:'TAPERED'}; static UNIFORM : any =  { type:3, value:'UNIFORM'}; 
}
export class IfcSensorTypeEnum {
	static CO2SENSOR : any =  { type:3, value:'CO2SENSOR'}; static CONDUCTANCESENSOR : any =  { type:3, value:'CONDUCTANCESENSOR'}; static CONTACTSENSOR : any =  { type:3, value:'CONTACTSENSOR'}; static COSENSOR : any =  { type:3, value:'COSENSOR'}; static EARTHQUAKESENSOR : any =  { type:3, value:'EARTHQUAKESENSOR'}; static FIRESENSOR : any =  { type:3, value:'FIRESENSOR'}; static FLOWSENSOR : any =  { type:3, value:'FLOWSENSOR'}; static FOREIGNOBJECTDETECTIONSENSOR : any =  { type:3, value:'FOREIGNOBJECTDETECTIONSENSOR'}; static FROSTSENSOR : any =  { type:3, value:'FROSTSENSOR'}; static GASSENSOR : any =  { type:3, value:'GASSENSOR'}; static HEATSENSOR : any =  { type:3, value:'HEATSENSOR'}; static HUMIDITYSENSOR : any =  { type:3, value:'HUMIDITYSENSOR'}; static IDENTIFIERSENSOR : any =  { type:3, value:'IDENTIFIERSENSOR'}; static IONCONCENTRATIONSENSOR : any =  { type:3, value:'IONCONCENTRATIONSENSOR'}; static LEVELSENSOR : any =  { type:3, value:'LEVELSENSOR'}; static LIGHTSENSOR : any =  { type:3, value:'LIGHTSENSOR'}; static MOISTURESENSOR : any =  { type:3, value:'MOISTURESENSOR'}; static MOVEMENTSENSOR : any =  { type:3, value:'MOVEMENTSENSOR'}; static OBSTACLESENSOR : any =  { type:3, value:'OBSTACLESENSOR'}; static PHSENSOR : any =  { type:3, value:'PHSENSOR'}; static PRESSURESENSOR : any =  { type:3, value:'PRESSURESENSOR'}; static RADIATIONSENSOR : any =  { type:3, value:'RADIATIONSENSOR'}; static RADIOACTIVITYSENSOR : any =  { type:3, value:'RADIOACTIVITYSENSOR'}; static RAINSENSOR : any =  { type:3, value:'RAINSENSOR'}; static SMOKESENSOR : any =  { type:3, value:'SMOKESENSOR'}; static SNOWDEPTHSENSOR : any =  { type:3, value:'SNOWDEPTHSENSOR'}; static SOUNDSENSOR : any =  { type:3, value:'SOUNDSENSOR'}; static TEMPERATURESENSOR : any =  { type:3, value:'TEMPERATURESENSOR'}; static TRAINSENSOR : any =  { type:3, value:'TRAINSENSOR'}; static TURNOUTCLOSURESENSOR : any =  { type:3, value:'TURNOUTCLOSURESENSOR'}; static WHEELSENSOR : any =  { type:3, value:'WHEELSENSOR'}; static WINDSENSOR : any =  { type:3, value:'WINDSENSOR'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSequenceEnum {
	static FINISH_FINISH : any =  { type:3, value:'FINISH_FINISH'}; static FINISH_START : any =  { type:3, value:'FINISH_START'}; static START_FINISH : any =  { type:3, value:'START_FINISH'}; static START_START : any =  { type:3, value:'START_START'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcShadingDeviceTypeEnum {
	static AWNING : any =  { type:3, value:'AWNING'}; static JALOUSIE : any =  { type:3, value:'JALOUSIE'}; static SHUTTER : any =  { type:3, value:'SHUTTER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSignTypeEnum {
	static MARKER : any =  { type:3, value:'MARKER'}; static MIRROR : any =  { type:3, value:'MIRROR'}; static PICTORAL : any =  { type:3, value:'PICTORAL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSignalTypeEnum {
	static AUDIO : any =  { type:3, value:'AUDIO'}; static MIXED : any =  { type:3, value:'MIXED'}; static VISUAL : any =  { type:3, value:'VISUAL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSimplePropertyTemplateTypeEnum {
	static P_BOUNDEDVALUE : any =  { type:3, value:'P_BOUNDEDVALUE'}; static P_ENUMERATEDVALUE : any =  { type:3, value:'P_ENUMERATEDVALUE'}; static P_LISTVALUE : any =  { type:3, value:'P_LISTVALUE'}; static P_REFERENCEVALUE : any =  { type:3, value:'P_REFERENCEVALUE'}; static P_SINGLEVALUE : any =  { type:3, value:'P_SINGLEVALUE'}; static P_TABLEVALUE : any =  { type:3, value:'P_TABLEVALUE'}; static Q_AREA : any =  { type:3, value:'Q_AREA'}; static Q_COUNT : any =  { type:3, value:'Q_COUNT'}; static Q_LENGTH : any =  { type:3, value:'Q_LENGTH'}; static Q_NUMBER : any =  { type:3, value:'Q_NUMBER'}; static Q_TIME : any =  { type:3, value:'Q_TIME'}; static Q_VOLUME : any =  { type:3, value:'Q_VOLUME'}; static Q_WEIGHT : any =  { type:3, value:'Q_WEIGHT'}; 
}
export class IfcSlabTypeEnum {
	static APPROACH_SLAB : any =  { type:3, value:'APPROACH_SLAB'}; static BASESLAB : any =  { type:3, value:'BASESLAB'}; static FLOOR : any =  { type:3, value:'FLOOR'}; static LANDING : any =  { type:3, value:'LANDING'}; static PAVING : any =  { type:3, value:'PAVING'}; static ROOF : any =  { type:3, value:'ROOF'}; static SIDEWALK : any =  { type:3, value:'SIDEWALK'}; static TRACKSLAB : any =  { type:3, value:'TRACKSLAB'}; static WEARING : any =  { type:3, value:'WEARING'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSolarDeviceTypeEnum {
	static SOLARCOLLECTOR : any =  { type:3, value:'SOLARCOLLECTOR'}; static SOLARPANEL : any =  { type:3, value:'SOLARPANEL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSpaceHeaterTypeEnum {
	static CONVECTOR : any =  { type:3, value:'CONVECTOR'}; static RADIATOR : any =  { type:3, value:'RADIATOR'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSpaceTypeEnum {
	static BERTH : any =  { type:3, value:'BERTH'}; static EXTERNAL : any =  { type:3, value:'EXTERNAL'}; static GFA : any =  { type:3, value:'GFA'}; static INTERNAL : any =  { type:3, value:'INTERNAL'}; static PARKING : any =  { type:3, value:'PARKING'}; static SPACE : any =  { type:3, value:'SPACE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSpatialZoneTypeEnum {
	static CONSTRUCTION : any =  { type:3, value:'CONSTRUCTION'}; static FIRESAFETY : any =  { type:3, value:'FIRESAFETY'}; static INTERFERENCE : any =  { type:3, value:'INTERFERENCE'}; static LIGHTING : any =  { type:3, value:'LIGHTING'}; static OCCUPANCY : any =  { type:3, value:'OCCUPANCY'}; static RESERVATION : any =  { type:3, value:'RESERVATION'}; static SECURITY : any =  { type:3, value:'SECURITY'}; static THERMAL : any =  { type:3, value:'THERMAL'}; static TRANSPORT : any =  { type:3, value:'TRANSPORT'}; static VENTILATION : any =  { type:3, value:'VENTILATION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcStackTerminalTypeEnum {
	static BIRDCAGE : any =  { type:3, value:'BIRDCAGE'}; static COWL : any =  { type:3, value:'COWL'}; static RAINWATERHOPPER : any =  { type:3, value:'RAINWATERHOPPER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcStairFlightTypeEnum {
	static CURVED : any =  { type:3, value:'CURVED'}; static FREEFORM : any =  { type:3, value:'FREEFORM'}; static SPIRAL : any =  { type:3, value:'SPIRAL'}; static STRAIGHT : any =  { type:3, value:'STRAIGHT'}; static WINDER : any =  { type:3, value:'WINDER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcStairTypeEnum {
	static CURVED_RUN_STAIR : any =  { type:3, value:'CURVED_RUN_STAIR'}; static DOUBLE_RETURN_STAIR : any =  { type:3, value:'DOUBLE_RETURN_STAIR'}; static HALF_TURN_STAIR : any =  { type:3, value:'HALF_TURN_STAIR'}; static HALF_WINDING_STAIR : any =  { type:3, value:'HALF_WINDING_STAIR'}; static LADDER : any =  { type:3, value:'LADDER'}; static QUARTER_TURN_STAIR : any =  { type:3, value:'QUARTER_TURN_STAIR'}; static QUARTER_WINDING_STAIR : any =  { type:3, value:'QUARTER_WINDING_STAIR'}; static SPIRAL_STAIR : any =  { type:3, value:'SPIRAL_STAIR'}; static STRAIGHT_RUN_STAIR : any =  { type:3, value:'STRAIGHT_RUN_STAIR'}; static THREE_QUARTER_TURN_STAIR : any =  { type:3, value:'THREE_QUARTER_TURN_STAIR'}; static THREE_QUARTER_WINDING_STAIR : any =  { type:3, value:'THREE_QUARTER_WINDING_STAIR'}; static TWO_CURVED_RUN_STAIR : any =  { type:3, value:'TWO_CURVED_RUN_STAIR'}; static TWO_QUARTER_TURN_STAIR : any =  { type:3, value:'TWO_QUARTER_TURN_STAIR'}; static TWO_QUARTER_WINDING_STAIR : any =  { type:3, value:'TWO_QUARTER_WINDING_STAIR'}; static TWO_STRAIGHT_RUN_STAIR : any =  { type:3, value:'TWO_STRAIGHT_RUN_STAIR'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcStateEnum {
	static LOCKED : any =  { type:3, value:'LOCKED'}; static READONLY : any =  { type:3, value:'READONLY'}; static READONLYLOCKED : any =  { type:3, value:'READONLYLOCKED'}; static READWRITE : any =  { type:3, value:'READWRITE'}; static READWRITELOCKED : any =  { type:3, value:'READWRITELOCKED'}; 
}
export class IfcStructuralCurveActivityTypeEnum {
	static CONST : any =  { type:3, value:'CONST'}; static DISCRETE : any =  { type:3, value:'DISCRETE'}; static EQUIDISTANT : any =  { type:3, value:'EQUIDISTANT'}; static LINEAR : any =  { type:3, value:'LINEAR'}; static PARABOLA : any =  { type:3, value:'PARABOLA'}; static POLYGONAL : any =  { type:3, value:'POLYGONAL'}; static SINUS : any =  { type:3, value:'SINUS'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcStructuralCurveMemberTypeEnum {
	static CABLE : any =  { type:3, value:'CABLE'}; static COMPRESSION_MEMBER : any =  { type:3, value:'COMPRESSION_MEMBER'}; static PIN_JOINED_MEMBER : any =  { type:3, value:'PIN_JOINED_MEMBER'}; static RIGID_JOINED_MEMBER : any =  { type:3, value:'RIGID_JOINED_MEMBER'}; static TENSION_MEMBER : any =  { type:3, value:'TENSION_MEMBER'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcStructuralSurfaceActivityTypeEnum {
	static BILINEAR : any =  { type:3, value:'BILINEAR'}; static CONST : any =  { type:3, value:'CONST'}; static DISCRETE : any =  { type:3, value:'DISCRETE'}; static ISOCONTOUR : any =  { type:3, value:'ISOCONTOUR'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcStructuralSurfaceMemberTypeEnum {
	static BENDING_ELEMENT : any =  { type:3, value:'BENDING_ELEMENT'}; static MEMBRANE_ELEMENT : any =  { type:3, value:'MEMBRANE_ELEMENT'}; static SHELL : any =  { type:3, value:'SHELL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSubContractResourceTypeEnum {
	static PURCHASE : any =  { type:3, value:'PURCHASE'}; static WORK : any =  { type:3, value:'WORK'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSurfaceFeatureTypeEnum {
	static DEFECT : any =  { type:3, value:'DEFECT'}; static HATCHMARKING : any =  { type:3, value:'HATCHMARKING'}; static LINEMARKING : any =  { type:3, value:'LINEMARKING'}; static MARK : any =  { type:3, value:'MARK'}; static NONSKIDSURFACING : any =  { type:3, value:'NONSKIDSURFACING'}; static PAVEMENTSURFACEMARKING : any =  { type:3, value:'PAVEMENTSURFACEMARKING'}; static RUMBLESTRIP : any =  { type:3, value:'RUMBLESTRIP'}; static SYMBOLMARKING : any =  { type:3, value:'SYMBOLMARKING'}; static TAG : any =  { type:3, value:'TAG'}; static TRANSVERSERUMBLESTRIP : any =  { type:3, value:'TRANSVERSERUMBLESTRIP'}; static TREATMENT : any =  { type:3, value:'TREATMENT'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSurfaceSide {
	static BOTH : any =  { type:3, value:'BOTH'}; static NEGATIVE : any =  { type:3, value:'NEGATIVE'}; static POSITIVE : any =  { type:3, value:'POSITIVE'}; 
}
export class IfcSwitchingDeviceTypeEnum {
	static CONTACTOR : any =  { type:3, value:'CONTACTOR'}; static DIMMERSWITCH : any =  { type:3, value:'DIMMERSWITCH'}; static EMERGENCYSTOP : any =  { type:3, value:'EMERGENCYSTOP'}; static KEYPAD : any =  { type:3, value:'KEYPAD'}; static MOMENTARYSWITCH : any =  { type:3, value:'MOMENTARYSWITCH'}; static RELAY : any =  { type:3, value:'RELAY'}; static SELECTORSWITCH : any =  { type:3, value:'SELECTORSWITCH'}; static STARTER : any =  { type:3, value:'STARTER'}; static START_AND_STOP_EQUIPMENT : any =  { type:3, value:'START_AND_STOP_EQUIPMENT'}; static SWITCHDISCONNECTOR : any =  { type:3, value:'SWITCHDISCONNECTOR'}; static TOGGLESWITCH : any =  { type:3, value:'TOGGLESWITCH'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcSystemFurnitureElementTypeEnum {
	static PANEL : any =  { type:3, value:'PANEL'}; static SUBRACK : any =  { type:3, value:'SUBRACK'}; static WORKSURFACE : any =  { type:3, value:'WORKSURFACE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTankTypeEnum {
	static BASIN : any =  { type:3, value:'BASIN'}; static BREAKPRESSURE : any =  { type:3, value:'BREAKPRESSURE'}; static EXPANSION : any =  { type:3, value:'EXPANSION'}; static FEEDANDEXPANSION : any =  { type:3, value:'FEEDANDEXPANSION'}; static OILRETENTIONTRAY : any =  { type:3, value:'OILRETENTIONTRAY'}; static PRESSUREVESSEL : any =  { type:3, value:'PRESSUREVESSEL'}; static STORAGE : any =  { type:3, value:'STORAGE'}; static VESSEL : any =  { type:3, value:'VESSEL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTaskDurationEnum {
	static ELAPSEDTIME : any =  { type:3, value:'ELAPSEDTIME'}; static WORKTIME : any =  { type:3, value:'WORKTIME'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTaskTypeEnum {
	static ADJUSTMENT : any =  { type:3, value:'ADJUSTMENT'}; static ATTENDANCE : any =  { type:3, value:'ATTENDANCE'}; static CALIBRATION : any =  { type:3, value:'CALIBRATION'}; static CONSTRUCTION : any =  { type:3, value:'CONSTRUCTION'}; static DEMOLITION : any =  { type:3, value:'DEMOLITION'}; static DISMANTLE : any =  { type:3, value:'DISMANTLE'}; static DISPOSAL : any =  { type:3, value:'DISPOSAL'}; static EMERGENCY : any =  { type:3, value:'EMERGENCY'}; static INSPECTION : any =  { type:3, value:'INSPECTION'}; static INSTALLATION : any =  { type:3, value:'INSTALLATION'}; static LOGISTIC : any =  { type:3, value:'LOGISTIC'}; static MAINTENANCE : any =  { type:3, value:'MAINTENANCE'}; static MOVE : any =  { type:3, value:'MOVE'}; static OPERATION : any =  { type:3, value:'OPERATION'}; static REMOVAL : any =  { type:3, value:'REMOVAL'}; static RENOVATION : any =  { type:3, value:'RENOVATION'}; static SAFETY : any =  { type:3, value:'SAFETY'}; static SHUTDOWN : any =  { type:3, value:'SHUTDOWN'}; static STARTUP : any =  { type:3, value:'STARTUP'}; static TESTING : any =  { type:3, value:'TESTING'}; static TROUBLESHOOTING : any =  { type:3, value:'TROUBLESHOOTING'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTendonAnchorTypeEnum {
	static COUPLER : any =  { type:3, value:'COUPLER'}; static FIXED_END : any =  { type:3, value:'FIXED_END'}; static TENSIONING_END : any =  { type:3, value:'TENSIONING_END'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTendonConduitTypeEnum {
	static COUPLER : any =  { type:3, value:'COUPLER'}; static DIABOLO : any =  { type:3, value:'DIABOLO'}; static DUCT : any =  { type:3, value:'DUCT'}; static GROUTING_DUCT : any =  { type:3, value:'GROUTING_DUCT'}; static TRUMPET : any =  { type:3, value:'TRUMPET'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTendonTypeEnum {
	static BAR : any =  { type:3, value:'BAR'}; static COATED : any =  { type:3, value:'COATED'}; static STRAND : any =  { type:3, value:'STRAND'}; static WIRE : any =  { type:3, value:'WIRE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTextPath {
	static DOWN : any =  { type:3, value:'DOWN'}; static LEFT : any =  { type:3, value:'LEFT'}; static RIGHT : any =  { type:3, value:'RIGHT'}; static UP : any =  { type:3, value:'UP'}; 
}
export class IfcTimeSeriesDataTypeEnum {
	static CONTINUOUS : any =  { type:3, value:'CONTINUOUS'}; static DISCRETE : any =  { type:3, value:'DISCRETE'}; static DISCRETEBINARY : any =  { type:3, value:'DISCRETEBINARY'}; static PIECEWISEBINARY : any =  { type:3, value:'PIECEWISEBINARY'}; static PIECEWISECONSTANT : any =  { type:3, value:'PIECEWISECONSTANT'}; static PIECEWISECONTINUOUS : any =  { type:3, value:'PIECEWISECONTINUOUS'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTrackElementTypeEnum {
	static BLOCKINGDEVICE : any =  { type:3, value:'BLOCKINGDEVICE'}; static DERAILER : any =  { type:3, value:'DERAILER'}; static FROG : any =  { type:3, value:'FROG'}; static HALF_SET_OF_BLADES : any =  { type:3, value:'HALF_SET_OF_BLADES'}; static SLEEPER : any =  { type:3, value:'SLEEPER'}; static SPEEDREGULATOR : any =  { type:3, value:'SPEEDREGULATOR'}; static TRACKENDOFALIGNMENT : any =  { type:3, value:'TRACKENDOFALIGNMENT'}; static VEHICLESTOP : any =  { type:3, value:'VEHICLESTOP'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTransformerTypeEnum {
	static CHOPPER : any =  { type:3, value:'CHOPPER'}; static COMBINED : any =  { type:3, value:'COMBINED'}; static CURRENT : any =  { type:3, value:'CURRENT'}; static FREQUENCY : any =  { type:3, value:'FREQUENCY'}; static INVERTER : any =  { type:3, value:'INVERTER'}; static RECTIFIER : any =  { type:3, value:'RECTIFIER'}; static VOLTAGE : any =  { type:3, value:'VOLTAGE'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcTransitionCode {
	static CONTINUOUS : any =  { type:3, value:'CONTINUOUS'}; static CONTSAMEGRADIENT : any =  { type:3, value:'CONTSAMEGRADIENT'}; static CONTSAMEGRADIENTSAMECURVATURE : any =  { type:3, value:'CONTSAMEGRADIENTSAMECURVATURE'}; static DISCONTINUOUS : any =  { type:3, value:'DISCONTINUOUS'}; 
}
export class IfcTransportElementTypeEnum {
	static CRANEWAY : any =  { type:3, value:'CRANEWAY'}; static ELEVATOR : any =  { type:3, value:'ELEVATOR'}; static ESCALATOR : any =  { type:3, value:'ESCALATOR'}; static HAULINGGEAR : any =  { type:3, value:'HAULINGGEAR'}; static LIFTINGGEAR : any =  { type:3, value:'LIFTINGGEAR'}; static MOVINGWALKWAY : any =  { type:3, value:'MOVINGWALKWAY'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
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
	static ALARMPANEL : any =  { type:3, value:'ALARMPANEL'}; static BASESTATIONCONTROLLER : any =  { type:3, value:'BASESTATIONCONTROLLER'}; static COMBINED : any =  { type:3, value:'COMBINED'}; static CONTROLPANEL : any =  { type:3, value:'CONTROLPANEL'}; static GASDETECTIONPANEL : any =  { type:3, value:'GASDETECTIONPANEL'}; static HUMIDISTAT : any =  { type:3, value:'HUMIDISTAT'}; static INDICATORPANEL : any =  { type:3, value:'INDICATORPANEL'}; static MIMICPANEL : any =  { type:3, value:'MIMICPANEL'}; static THERMOSTAT : any =  { type:3, value:'THERMOSTAT'}; static WEATHERSTATION : any =  { type:3, value:'WEATHERSTATION'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcUnitaryEquipmentTypeEnum {
	static AIRCONDITIONINGUNIT : any =  { type:3, value:'AIRCONDITIONINGUNIT'}; static AIRHANDLER : any =  { type:3, value:'AIRHANDLER'}; static DEHUMIDIFIER : any =  { type:3, value:'DEHUMIDIFIER'}; static ROOFTOPUNIT : any =  { type:3, value:'ROOFTOPUNIT'}; static SPLITSYSTEM : any =  { type:3, value:'SPLITSYSTEM'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcValveTypeEnum {
	static AIRRELEASE : any =  { type:3, value:'AIRRELEASE'}; static ANTIVACUUM : any =  { type:3, value:'ANTIVACUUM'}; static CHANGEOVER : any =  { type:3, value:'CHANGEOVER'}; static CHECK : any =  { type:3, value:'CHECK'}; static COMMISSIONING : any =  { type:3, value:'COMMISSIONING'}; static DIVERTING : any =  { type:3, value:'DIVERTING'}; static DOUBLECHECK : any =  { type:3, value:'DOUBLECHECK'}; static DOUBLEREGULATING : any =  { type:3, value:'DOUBLEREGULATING'}; static DRAWOFFCOCK : any =  { type:3, value:'DRAWOFFCOCK'}; static FAUCET : any =  { type:3, value:'FAUCET'}; static FLUSHING : any =  { type:3, value:'FLUSHING'}; static GASCOCK : any =  { type:3, value:'GASCOCK'}; static GASTAP : any =  { type:3, value:'GASTAP'}; static ISOLATING : any =  { type:3, value:'ISOLATING'}; static MIXING : any =  { type:3, value:'MIXING'}; static PRESSUREREDUCING : any =  { type:3, value:'PRESSUREREDUCING'}; static PRESSURERELIEF : any =  { type:3, value:'PRESSURERELIEF'}; static REGULATING : any =  { type:3, value:'REGULATING'}; static SAFETYCUTOFF : any =  { type:3, value:'SAFETYCUTOFF'}; static STEAMTRAP : any =  { type:3, value:'STEAMTRAP'}; static STOPCOCK : any =  { type:3, value:'STOPCOCK'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcVehicleTypeEnum {
	static CARGO : any =  { type:3, value:'CARGO'}; static ROLLINGSTOCK : any =  { type:3, value:'ROLLINGSTOCK'}; static VEHICLE : any =  { type:3, value:'VEHICLE'}; static VEHICLEAIR : any =  { type:3, value:'VEHICLEAIR'}; static VEHICLEMARINE : any =  { type:3, value:'VEHICLEMARINE'}; static VEHICLETRACKED : any =  { type:3, value:'VEHICLETRACKED'}; static VEHICLEWHEELED : any =  { type:3, value:'VEHICLEWHEELED'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcVibrationDamperTypeEnum {
	static AXIAL_YIELD : any =  { type:3, value:'AXIAL_YIELD'}; static BENDING_YIELD : any =  { type:3, value:'BENDING_YIELD'}; static FRICTION : any =  { type:3, value:'FRICTION'}; static RUBBER : any =  { type:3, value:'RUBBER'}; static SHEAR_YIELD : any =  { type:3, value:'SHEAR_YIELD'}; static VISCOUS : any =  { type:3, value:'VISCOUS'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcVibrationIsolatorTypeEnum {
	static BASE : any =  { type:3, value:'BASE'}; static COMPRESSION : any =  { type:3, value:'COMPRESSION'}; static SPRING : any =  { type:3, value:'SPRING'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcVirtualElementTypeEnum {
	static BOUNDARY : any =  { type:3, value:'BOUNDARY'}; static CLEARANCE : any =  { type:3, value:'CLEARANCE'}; static PROVISIONFORVOID : any =  { type:3, value:'PROVISIONFORVOID'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcVoidingFeatureTypeEnum {
	static CHAMFER : any =  { type:3, value:'CHAMFER'}; static CUTOUT : any =  { type:3, value:'CUTOUT'}; static EDGE : any =  { type:3, value:'EDGE'}; static HOLE : any =  { type:3, value:'HOLE'}; static MITER : any =  { type:3, value:'MITER'}; static NOTCH : any =  { type:3, value:'NOTCH'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcWallTypeEnum {
	static ELEMENTEDWALL : any =  { type:3, value:'ELEMENTEDWALL'}; static MOVABLE : any =  { type:3, value:'MOVABLE'}; static PARAPET : any =  { type:3, value:'PARAPET'}; static PARTITIONING : any =  { type:3, value:'PARTITIONING'}; static PLUMBINGWALL : any =  { type:3, value:'PLUMBINGWALL'}; static POLYGONAL : any =  { type:3, value:'POLYGONAL'}; static RETAININGWALL : any =  { type:3, value:'RETAININGWALL'}; static SHEAR : any =  { type:3, value:'SHEAR'}; static SOLIDWALL : any =  { type:3, value:'SOLIDWALL'}; static STANDARD : any =  { type:3, value:'STANDARD'}; static WAVEWALL : any =  { type:3, value:'WAVEWALL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcWasteTerminalTypeEnum {
	static FLOORTRAP : any =  { type:3, value:'FLOORTRAP'}; static FLOORWASTE : any =  { type:3, value:'FLOORWASTE'}; static GULLYSUMP : any =  { type:3, value:'GULLYSUMP'}; static GULLYTRAP : any =  { type:3, value:'GULLYTRAP'}; static ROOFDRAIN : any =  { type:3, value:'ROOFDRAIN'}; static WASTEDISPOSALUNIT : any =  { type:3, value:'WASTEDISPOSALUNIT'}; static WASTETRAP : any =  { type:3, value:'WASTETRAP'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcWindowPanelOperationEnum {
	static BOTTOMHUNG : any =  { type:3, value:'BOTTOMHUNG'}; static FIXEDCASEMENT : any =  { type:3, value:'FIXEDCASEMENT'}; static OTHEROPERATION : any =  { type:3, value:'OTHEROPERATION'}; static PIVOTHORIZONTAL : any =  { type:3, value:'PIVOTHORIZONTAL'}; static PIVOTVERTICAL : any =  { type:3, value:'PIVOTVERTICAL'}; static REMOVABLECASEMENT : any =  { type:3, value:'REMOVABLECASEMENT'}; static SIDEHUNGLEFTHAND : any =  { type:3, value:'SIDEHUNGLEFTHAND'}; static SIDEHUNGRIGHTHAND : any =  { type:3, value:'SIDEHUNGRIGHTHAND'}; static SLIDINGHORIZONTAL : any =  { type:3, value:'SLIDINGHORIZONTAL'}; static SLIDINGVERTICAL : any =  { type:3, value:'SLIDINGVERTICAL'}; static TILTANDTURNLEFTHAND : any =  { type:3, value:'TILTANDTURNLEFTHAND'}; static TILTANDTURNRIGHTHAND : any =  { type:3, value:'TILTANDTURNRIGHTHAND'}; static TOPHUNG : any =  { type:3, value:'TOPHUNG'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcWindowPanelPositionEnum {
	static BOTTOM : any =  { type:3, value:'BOTTOM'}; static LEFT : any =  { type:3, value:'LEFT'}; static MIDDLE : any =  { type:3, value:'MIDDLE'}; static RIGHT : any =  { type:3, value:'RIGHT'}; static TOP : any =  { type:3, value:'TOP'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcWindowStyleConstructionEnum {
	static ALUMINIUM : any =  { type:3, value:'ALUMINIUM'}; static ALUMINIUM_WOOD : any =  { type:3, value:'ALUMINIUM_WOOD'}; static HIGH_GRADE_STEEL : any =  { type:3, value:'HIGH_GRADE_STEEL'}; static OTHER_CONSTRUCTION : any =  { type:3, value:'OTHER_CONSTRUCTION'}; static PLASTIC : any =  { type:3, value:'PLASTIC'}; static STEEL : any =  { type:3, value:'STEEL'}; static WOOD : any =  { type:3, value:'WOOD'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcWindowStyleOperationEnum {
	static DOUBLE_PANEL_HORIZONTAL : any =  { type:3, value:'DOUBLE_PANEL_HORIZONTAL'}; static DOUBLE_PANEL_VERTICAL : any =  { type:3, value:'DOUBLE_PANEL_VERTICAL'}; static SINGLE_PANEL : any =  { type:3, value:'SINGLE_PANEL'}; static TRIPLE_PANEL_BOTTOM : any =  { type:3, value:'TRIPLE_PANEL_BOTTOM'}; static TRIPLE_PANEL_HORIZONTAL : any =  { type:3, value:'TRIPLE_PANEL_HORIZONTAL'}; static TRIPLE_PANEL_LEFT : any =  { type:3, value:'TRIPLE_PANEL_LEFT'}; static TRIPLE_PANEL_RIGHT : any =  { type:3, value:'TRIPLE_PANEL_RIGHT'}; static TRIPLE_PANEL_TOP : any =  { type:3, value:'TRIPLE_PANEL_TOP'}; static TRIPLE_PANEL_VERTICAL : any =  { type:3, value:'TRIPLE_PANEL_VERTICAL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcWindowTypeEnum {
	static LIGHTDOME : any =  { type:3, value:'LIGHTDOME'}; static SKYLIGHT : any =  { type:3, value:'SKYLIGHT'}; static WINDOW : any =  { type:3, value:'WINDOW'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
}
export class IfcWindowTypePartitioningEnum {
	static DOUBLE_PANEL_HORIZONTAL : any =  { type:3, value:'DOUBLE_PANEL_HORIZONTAL'}; static DOUBLE_PANEL_VERTICAL : any =  { type:3, value:'DOUBLE_PANEL_VERTICAL'}; static SINGLE_PANEL : any =  { type:3, value:'SINGLE_PANEL'}; static TRIPLE_PANEL_BOTTOM : any =  { type:3, value:'TRIPLE_PANEL_BOTTOM'}; static TRIPLE_PANEL_HORIZONTAL : any =  { type:3, value:'TRIPLE_PANEL_HORIZONTAL'}; static TRIPLE_PANEL_LEFT : any =  { type:3, value:'TRIPLE_PANEL_LEFT'}; static TRIPLE_PANEL_RIGHT : any =  { type:3, value:'TRIPLE_PANEL_RIGHT'}; static TRIPLE_PANEL_TOP : any =  { type:3, value:'TRIPLE_PANEL_TOP'}; static TRIPLE_PANEL_VERTICAL : any =  { type:3, value:'TRIPLE_PANEL_VERTICAL'}; static USERDEFINED : any =  { type:3, value:'USERDEFINED'}; static NOTDEFINED : any =  { type:3, value:'NOTDEFINED'}; 
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
export type IfcCurveMeasureSelect =  | IfcNonNegativeLengthMeasure | IfcParameterValue;
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
export type IfcInterferenceSelect =  | (Reference<IfcElement> | IfcElement) | (Reference<IfcSpatialElement> | IfcSpatialElement);
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
export type IfcProcessSelect =  | (Reference<IfcProcess> | IfcProcess) | (Reference<IfcTypeProcess> | IfcTypeProcess);
export type IfcProductRepresentationSelect =  | (Reference<IfcProductDefinitionShape> | IfcProductDefinitionShape) | (Reference<IfcRepresentationMap> | IfcRepresentationMap);
export type IfcProductSelect =  | (Reference<IfcProduct> | IfcProduct) | (Reference<IfcTypeProduct> | IfcTypeProduct);
export type IfcPropertySetDefinitionSelect =  | (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition) | IfcPropertySetDefinitionSet;
export type IfcResourceObjectSelect =  | (Reference<IfcActorRole> | IfcActorRole) | (Reference<IfcAppliedValue> | IfcAppliedValue) | (Reference<IfcApproval> | IfcApproval) | (Reference<IfcConstraint> | IfcConstraint) | (Reference<IfcContextDependentUnit> | IfcContextDependentUnit) | (Reference<IfcConversionBasedUnit> | IfcConversionBasedUnit) | (Reference<IfcExternalInformation> | IfcExternalInformation) | (Reference<IfcExternalReference> | IfcExternalReference) | (Reference<IfcMaterialDefinition> | IfcMaterialDefinition) | (Reference<IfcOrganization> | IfcOrganization) | (Reference<IfcPerson> | IfcPerson) | (Reference<IfcPersonAndOrganization> | IfcPersonAndOrganization) | (Reference<IfcPhysicalQuantity> | IfcPhysicalQuantity) | (Reference<IfcProfileDef> | IfcProfileDef) | (Reference<IfcPropertyAbstraction> | IfcPropertyAbstraction) | (Reference<IfcShapeAspect> | IfcShapeAspect) | (Reference<IfcTimeSeries> | IfcTimeSeries);
export type IfcResourceSelect =  | (Reference<IfcResource> | IfcResource) | (Reference<IfcTypeResource> | IfcTypeResource);
export type IfcRotationalStiffnessSelect =  | IfcBoolean | IfcRotationalStiffnessMeasure;
export type IfcSegmentIndexSelect =  | IfcArcIndex | IfcLineIndex;
export type IfcShell =  | (Reference<IfcClosedShell> | IfcClosedShell) | (Reference<IfcOpenShell> | IfcOpenShell);
export type IfcSimpleValue =  | IfcBinary | IfcBoolean | IfcDate | IfcDateTime | IfcDuration | IfcIdentifier | IfcInteger | IfcLabel | IfcLogical | IfcPositiveInteger | IfcReal | IfcText | IfcTime | IfcTimeStamp;
export type IfcSizeSelect =  | IfcDescriptiveMeasure | IfcLengthMeasure | IfcNormalisedRatioMeasure | IfcPositiveLengthMeasure | IfcPositiveRatioMeasure | IfcRatioMeasure;
export type IfcSolidOrShell =  | (Reference<IfcClosedShell> | IfcClosedShell) | (Reference<IfcSolidModel> | IfcSolidModel);
export type IfcSpaceBoundarySelect =  | (Reference<IfcExternalSpatialElement> | IfcExternalSpatialElement) | (Reference<IfcSpace> | IfcSpace);
export type IfcSpatialReferenceSelect =  | (Reference<IfcGroup> | IfcGroup) | (Reference<IfcProduct> | IfcProduct);
export type IfcSpecularHighlightSelect =  | IfcSpecularExponent | IfcSpecularRoughness;
export type IfcStructuralActivityAssignmentSelect =  | (Reference<IfcElement> | IfcElement) | (Reference<IfcStructuralItem> | IfcStructuralItem);
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
export class IfcAlignmentParameterSegment extends IfcLineObject {
	expressID:number=2879124712;
	constructor(expressID: number, public StartTag: IfcLabel | null, public EndTag: IfcLabel | null)
	{
		super(expressID);
	}
}
export class IfcAlignmentVerticalSegment extends IfcAlignmentParameterSegment {
	expressID:number=3633395639;
	constructor(expressID: number, public StartTag: IfcLabel | null, public EndTag: IfcLabel | null, public StartDistAlong: IfcLengthMeasure , public HorizontalLength: IfcNonNegativeLengthMeasure , public StartHeight: IfcLengthMeasure , public StartGradient: IfcRatioMeasure , public EndGradient: IfcRatioMeasure , public RadiusOfCurvature: IfcLengthMeasure | null, public PredefinedType: IfcAlignmentVerticalSegmentTypeEnum )
	{
		super(expressID,StartTag, EndTag);
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
	constructor(expressID: number, public Elements: (Reference<IfcDerivedUnitElement> | IfcDerivedUnitElement)[] , public UnitType: IfcDerivedUnitEnum , public UserDefinedType: IfcLabel | null, public Name: IfcLabel | null)
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
	constructor(expressID: number, public SourceCRS: IfcCoordinateReferenceSystemSelect , public TargetCRS: (Reference<IfcCoordinateReferenceSystem> | IfcCoordinateReferenceSystem) , public Eastings: IfcLengthMeasure , public Northings: IfcLengthMeasure , public OrthogonalHeight: IfcLengthMeasure , public XAxisAbscissa: IfcReal | null, public XAxisOrdinate: IfcReal | null, public Scale: IfcReal | null, public ScaleY: IfcReal | null, public ScaleZ: IfcReal | null)
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
	ReferencedByPlacements!: (Reference<IfcObjectPlacement> | IfcObjectPlacement)[] | null;
	constructor(expressID: number, public PlacementRelTo: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null)
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
export class IfcQuantityNumber extends IfcPhysicalSimpleQuantity {
	expressID:number=2691318326;
	constructor(expressID: number, public Name: IfcLabel , public Description: IfcText | null, public Unit: (Reference<IfcNamedUnit> | IfcNamedUnit) | null, public NumberValue: IfcNumericMeasure , public Formula: IfcLabel | null)
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
	constructor(expressID: number, public Dimensions: (Reference<IfcDimensionalExponents> | IfcDimensionalExponents) , public UnitType: IfcUnitEnum , public Prefix: IfcSIPrefix | null, public Name: IfcSIUnitName )
	{
		super(expressID,Dimensions, UnitType);
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
	HasExternalReferences!: (Reference<IfcExternalReferenceRelationship> | IfcExternalReferenceRelationship)[] | null;
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
	constructor(expressID: number, public Item: (Reference<IfcRepresentationItem> | IfcRepresentationItem) | null, public Styles: (Reference<IfcPresentationStyle> | IfcPresentationStyle)[] , public Name: IfcLabel | null)
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
export class IfcTextureCoordinateIndices extends IfcLineObject {
	expressID:number=222769930;
	ToTexMap!: (Reference<IfcIndexedPolygonalTextureMap> | IfcIndexedPolygonalTextureMap) | null;
	constructor(expressID: number, public TexCoordIndex: IfcPositiveInteger[] , public TexCoordsOf: (Reference<IfcIndexedPolygonalFace> | IfcIndexedPolygonalFace) )
	{
		super(expressID);
	}
}
export class IfcTextureCoordinateIndicesWithVoids extends IfcTextureCoordinateIndices {
	expressID:number=1010789467;
	constructor(expressID: number, public TexCoordIndex: IfcPositiveInteger[] , public TexCoordsOf: (Reference<IfcIndexedPolygonalFace> | IfcIndexedPolygonalFace) , public InnerTexCoordIndices: IfcPositiveInteger[] )
	{
		super(expressID,TexCoordIndex, TexCoordsOf);
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
	constructor(expressID: number, public Name: IfcLabel | null, public DataOrigin: IfcDataOriginEnum | null, public UserDefinedDataOrigin: IfcLabel | null, public RecurrencePattern: (Reference<IfcRecurrencePattern> | IfcRecurrencePattern) | null, public StartDate: IfcDate | null, public FinishDate: IfcDate | null)
	{
		super(expressID,Name, DataOrigin, UserDefinedDataOrigin);
	}
}
export class IfcAlignmentCantSegment extends IfcAlignmentParameterSegment {
	expressID:number=3752311538;
	constructor(expressID: number, public StartTag: IfcLabel | null, public EndTag: IfcLabel | null, public StartDistAlong: IfcLengthMeasure , public HorizontalLength: IfcNonNegativeLengthMeasure , public StartCantLeft: IfcLengthMeasure , public EndCantLeft: IfcLengthMeasure | null, public StartCantRight: IfcLengthMeasure , public EndCantRight: IfcLengthMeasure | null, public PredefinedType: IfcAlignmentCantSegmentTypeEnum )
	{
		super(expressID,StartTag, EndTag);
	}
}
export class IfcAlignmentHorizontalSegment extends IfcAlignmentParameterSegment {
	expressID:number=536804194;
	constructor(expressID: number, public StartTag: IfcLabel | null, public EndTag: IfcLabel | null, public StartPoint: (Reference<IfcCartesianPoint> | IfcCartesianPoint) , public StartDirection: IfcPlaneAngleMeasure , public StartRadiusOfCurvature: IfcLengthMeasure , public EndRadiusOfCurvature: IfcLengthMeasure , public SegmentLength: IfcNonNegativeLengthMeasure , public GravityCenterLineHeight: IfcPositiveLengthMeasure | null, public PredefinedType: IfcAlignmentHorizontalSegmentTypeEnum )
	{
		super(expressID,StartTag, EndTag);
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
	constructor(expressID: number, public Source: IfcLabel | null, public Edition: IfcLabel | null, public EditionDate: IfcDate | null, public Name: IfcLabel , public Description: IfcText | null, public Specification: IfcURIReference | null, public ReferenceTokens: IfcIdentifier[] | null)
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
	constructor(expressID: number, public Name: IfcLabel | null, public CurveStyleFont: IfcCurveStyleFontSelect , public CurveFontScaling: IfcPositiveRatioMeasure )
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
	constructor(expressID: number, public Name: IfcLabel | null, public FillStyles: IfcFillStyleSelect[] , public ModelOrDraughting: IfcBoolean | null)
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
	constructor(expressID: number, public ContextIdentifier: IfcLabel | null, public ContextType: IfcLabel | null, public WorldCoordinateSystem: IfcAxis2Placement , public ParentContext: (Reference<IfcGeometricRepresentationContext> | IfcGeometricRepresentationContext) , public TargetScale: IfcPositiveRatioMeasure | null, public TargetView: IfcGeometricProjectionEnum , public UserDefinedTargetView: IfcLabel | null)
	{
		super(expressID,ContextIdentifier, ContextType, new IfcDimensionCount(0), null, WorldCoordinateSystem, null);
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
	constructor(expressID: number, public PlacementRelTo: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public PlacementLocation: (Reference<IfcVirtualGridIntersection> | IfcVirtualGridIntersection) , public PlacementRefDirection: IfcGridPlacementDirectionSelect | null)
	{
		super(expressID,PlacementRelTo);
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
export class IfcLinearPlacement extends IfcObjectPlacement {
	expressID:number=388784114;
	constructor(expressID: number, public PlacementRelTo: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public RelativePlacement: (Reference<IfcAxis2PlacementLinear> | IfcAxis2PlacementLinear) , public CartesianPosition: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) | null)
	{
		super(expressID,PlacementRelTo);
	}
}
export class IfcLocalPlacement extends IfcObjectPlacement {
	expressID:number=2624227202;
	constructor(expressID: number, public PlacementRelTo: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public RelativePlacement: IfcAxis2Placement )
	{
		super(expressID,PlacementRelTo);
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
	constructor(expressID: number, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingMaterial: (Reference<IfcMaterial> | IfcMaterial) , public RelatedMaterials: (Reference<IfcMaterial> | IfcMaterial)[] , public MaterialExpression: IfcLabel | null)
	{
		super(expressID,Name, Description);
	}
}
export class IfcMirroredProfileDef extends IfcDerivedProfileDef {
	expressID:number=2998442950;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public ParentProfile: (Reference<IfcProfileDef> | IfcProfileDef) , public Operator: (Reference<IfcCartesianTransformationOperator2D> | IfcCartesianTransformationOperator2D) , public Label: IfcLabel | null)
	{
		super(expressID,ProfileType, ProfileName, ParentProfile, Operator, Label);
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
export class IfcOpenCrossProfileDef extends IfcProfileDef {
	expressID:number=182550632;
	constructor(expressID: number, public ProfileType: IfcProfileTypeEnum , public ProfileName: IfcLabel | null, public HorizontalWidths: IfcBoolean , public Widths: IfcNonNegativeLengthMeasure[] , public Slopes: IfcPlaneAngleMeasure[] , public Tags: IfcLabel[] | null, public OffsetPoint: (Reference<IfcCartesianPoint> | IfcCartesianPoint) | null)
	{
		super(expressID,ProfileType, ProfileName);
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
	constructor(expressID: number, public EdgeStart: (Reference<IfcVertex> | IfcVertex) , public EdgeElement: (Reference<IfcEdge> | IfcEdge) , public Orientation: IfcBoolean )
	{
		super(expressID,EdgeStart, new Reference(0));
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
	constructor(expressID: number, public Location: (Reference<IfcPoint> | IfcPoint) )
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
export class IfcPointByDistanceExpression extends IfcPoint {
	expressID:number=2165702409;
	constructor(expressID: number, public DistanceAlong: IfcCurveMeasureSelect , public OffsetLateral: IfcLengthMeasure | null, public OffsetVertical: IfcLengthMeasure | null, public OffsetLongitudinal: IfcLengthMeasure | null, public BasisCurve: (Reference<IfcCurve> | IfcCurve) )
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
	constructor(expressID: number, public Name: IfcIdentifier , public Specification: IfcText | null)
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
export class IfcSegment extends IfcGeometricRepresentationItem {
	expressID:number=823603102;
	UsingCurves!: (Reference<IfcCompositeCurve> | IfcCompositeCurve)[] | null;
	constructor(expressID: number, public Transition: IfcTransitionCode )
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
	constructor(expressID: number, public Name: IfcIdentifier , public Specification: IfcText | null)
	{
		super(expressID,Name, Specification);
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
	constructor(expressID: number, public Directrix: (Reference<IfcCurve> | IfcCurve) , public Radius: IfcPositiveLengthMeasure , public InnerRadius: IfcPositiveLengthMeasure | null, public StartParam: IfcParameterValue | null, public EndParam: IfcParameterValue | null, public FilletRadius: IfcNonNegativeLengthMeasure | null)
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
	constructor(expressID: number, public Location: (Reference<IfcPoint> | IfcPoint) , public Axis: (Reference<IfcDirection> | IfcDirection) | null)
	{
		super(expressID,Location);
	}
}
export class IfcAxis2Placement2D extends IfcPlacement {
	expressID:number=3125803723;
	constructor(expressID: number, public Location: (Reference<IfcPoint> | IfcPoint) , public RefDirection: (Reference<IfcDirection> | IfcDirection) | null)
	{
		super(expressID,Location);
	}
}
export class IfcAxis2Placement3D extends IfcPlacement {
	expressID:number=2740243338;
	constructor(expressID: number, public Location: (Reference<IfcPoint> | IfcPoint) , public Axis: (Reference<IfcDirection> | IfcDirection) | null, public RefDirection: (Reference<IfcDirection> | IfcDirection) | null)
	{
		super(expressID,Location);
	}
}
export class IfcAxis2PlacementLinear extends IfcPlacement {
	expressID:number=3425423356;
	constructor(expressID: number, public Location: (Reference<IfcPoint> | IfcPoint) , public Axis: (Reference<IfcDirection> | IfcDirection) | null, public RefDirection: (Reference<IfcDirection> | IfcDirection) | null)
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
	constructor(expressID: number, public CoordList: IfcLengthMeasure[] , public TagList: IfcLabel[] | null)
	{
			super(expressID);
	}
}
export class IfcCartesianPointList3D extends IfcCartesianPointList {
	expressID:number=2059837836;
	constructor(expressID: number, public CoordList: IfcLengthMeasure[] , public TagList: IfcLabel[] | null)
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
	constructor(expressID: number, public Name: IfcIdentifier , public Specification: IfcText | null, public UsageName: IfcIdentifier , public HasProperties: (Reference<IfcProperty> | IfcProperty)[] )
	{
		super(expressID,Name, Specification);
	}
}
export class IfcCompositeCurveSegment extends IfcSegment {
	expressID:number=2485617015;
	constructor(expressID: number, public Transition: IfcTransitionCode , public SameSense: IfcBoolean , public ParentCurve: (Reference<IfcCurve> | IfcCurve) )
	{
		super(expressID,Transition);
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
export class IfcCurveSegment extends IfcSegment {
	expressID:number=4212018352;
	constructor(expressID: number, public Transition: IfcTransitionCode , public Placement: (Reference<IfcPlacement> | IfcPlacement) , public SegmentStart: IfcCurveMeasureSelect , public SegmentLength: IfcCurveMeasureSelect , public ParentCurve: (Reference<IfcCurve> | IfcCurve) )
	{
		super(expressID,Transition);
	}
}
export class IfcDirection extends IfcGeometricRepresentationItem {
	expressID:number=32440307;
	constructor(expressID: number, public DirectionRatios: IfcReal[] )
	{
			super(expressID);
	}
}
export class IfcDirectrixCurveSweptAreaSolid extends IfcSweptAreaSolid {
	expressID:number=593015953;
	constructor(expressID: number, public SweptArea: (Reference<IfcProfileDef> | IfcProfileDef) , public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) | null, public Directrix: (Reference<IfcCurve> | IfcCurve) , public StartParam: IfcCurveMeasureSelect | null, public EndParam: IfcCurveMeasureSelect | null)
	{
		super(expressID,SweptArea, Position);
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
export class IfcFixedReferenceSweptAreaSolid extends IfcDirectrixCurveSweptAreaSolid {
	expressID:number=2652556860;
	constructor(expressID: number, public SweptArea: (Reference<IfcProfileDef> | IfcProfileDef) , public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) | null, public Directrix: (Reference<IfcCurve> | IfcCurve) , public StartParam: IfcCurveMeasureSelect | null, public EndParam: IfcCurveMeasureSelect | null, public FixedReference: (Reference<IfcDirection> | IfcDirection) )
	{
		super(expressID,SweptArea, Position, Directrix, StartParam, EndParam);
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
	HasTexCoords!: (Reference<IfcTextureCoordinateIndices> | IfcTextureCoordinateIndices)[] | null;
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
export class IfcIndexedPolygonalTextureMap extends IfcIndexedTextureMap {
	expressID:number=3465909080;
	constructor(expressID: number, public Maps: (Reference<IfcSurfaceTexture> | IfcSurfaceTexture)[] , public MappedTo: (Reference<IfcTessellatedFaceSet> | IfcTessellatedFaceSet) , public TexCoords: (Reference<IfcTextureVertexList> | IfcTextureVertexList) , public TexCoordIndices: (Reference<IfcTextureCoordinateIndices> | IfcTextureCoordinateIndices)[] )
	{
		super(expressID,Maps, MappedTo, TexCoords);
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
export class IfcOffsetCurve extends IfcCurve {
	expressID:number=590820931;
	constructor(expressID: number, public BasisCurve: (Reference<IfcCurve> | IfcCurve) )
	{
			super(expressID);
	}
}
export class IfcOffsetCurve2D extends IfcOffsetCurve {
	expressID:number=3388369263;
	constructor(expressID: number, public BasisCurve: (Reference<IfcCurve> | IfcCurve) , public Distance: IfcLengthMeasure , public SelfIntersect: IfcLogical )
	{
		super(expressID,BasisCurve);
	}
}
export class IfcOffsetCurve3D extends IfcOffsetCurve {
	expressID:number=3505215534;
	constructor(expressID: number, public BasisCurve: (Reference<IfcCurve> | IfcCurve) , public Distance: IfcLengthMeasure , public SelfIntersect: IfcLogical , public RefDirection: (Reference<IfcDirection> | IfcDirection) )
	{
		super(expressID,BasisCurve);
	}
}
export class IfcOffsetCurveByDistances extends IfcOffsetCurve {
	expressID:number=2485787929;
	constructor(expressID: number, public BasisCurve: (Reference<IfcCurve> | IfcCurve) , public OffsetValues: (Reference<IfcPointByDistanceExpression> | IfcPointByDistanceExpression)[] , public Tag: IfcLabel | null)
	{
		super(expressID,BasisCurve);
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
export class IfcPolynomialCurve extends IfcCurve {
	expressID:number=3381221214;
	constructor(expressID: number, public Position: (Reference<IfcPlacement> | IfcPlacement) , public CoefficientsX: IfcReal[] | null, public CoefficientsY: IfcReal[] | null, public CoefficientsZ: IfcReal[] | null)
	{
			super(expressID);
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
	PositionedRelativeTo!: (Reference<IfcRelPositions> | IfcRelPositions)[] | null;
	ReferencedInStructures!: (Reference<IfcRelReferencedInSpatialStructure> | IfcRelReferencedInSpatialStructure)[] | null;
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
	constructor(expressID: number, public Name: IfcIdentifier , public Specification: IfcText | null, public UpperBoundValue: IfcValue | null, public LowerBoundValue: IfcValue | null, public Unit: IfcUnit | null, public SetPointValue: IfcValue | null)
	{
		super(expressID,Name, Specification);
	}
}
export class IfcPropertyEnumeratedValue extends IfcSimpleProperty {
	expressID:number=4166981789;
	constructor(expressID: number, public Name: IfcIdentifier , public Specification: IfcText | null, public EnumerationValues: IfcValue[] | null, public EnumerationReference: (Reference<IfcPropertyEnumeration> | IfcPropertyEnumeration) | null)
	{
		super(expressID,Name, Specification);
	}
}
export class IfcPropertyListValue extends IfcSimpleProperty {
	expressID:number=2752243245;
	constructor(expressID: number, public Name: IfcIdentifier , public Specification: IfcText | null, public ListValues: IfcValue[] | null, public Unit: IfcUnit | null)
	{
		super(expressID,Name, Specification);
	}
}
export class IfcPropertyReferenceValue extends IfcSimpleProperty {
	expressID:number=941946838;
	constructor(expressID: number, public Name: IfcIdentifier , public Specification: IfcText | null, public UsageName: IfcText | null, public PropertyReference: IfcObjectReferenceSelect | null)
	{
		super(expressID,Name, Specification);
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
	constructor(expressID: number, public Name: IfcIdentifier , public Specification: IfcText | null, public NominalValue: IfcValue | null, public Unit: IfcUnit | null)
	{
		super(expressID,Name, Specification);
	}
}
export class IfcPropertyTableValue extends IfcSimpleProperty {
	expressID:number=110355661;
	constructor(expressID: number, public Name: IfcIdentifier , public Specification: IfcText | null, public DefiningValues: IfcValue[] | null, public DefinedValues: IfcValue[] | null, public Expression: IfcText | null, public DefiningUnit: IfcUnit | null, public DefinedUnit: IfcUnit | null, public CurveInterpolation: IfcCurveInterpolationEnum | null)
	{
		super(expressID,Name, Specification);
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
export class IfcRelAssociatesProfileDef extends IfcRelAssociates {
	expressID:number=1033248425;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatedObjects: IfcDefinitionSelect[] , public RelatingProfileDef: (Reference<IfcProfileDef> | IfcProfileDef) )
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
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingElement: IfcInterferenceSelect , public RelatedElement: IfcInterferenceSelect , public InterferenceGeometry: (Reference<IfcConnectionGeometry> | IfcConnectionGeometry) | null, public InterferenceSpace: (Reference<IfcSpatialZone> | IfcSpatialZone) | null, public InterferenceType: IfcIdentifier | null, public ImpliedOrder: IfcLogical )
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
export class IfcRelPositions extends IfcRelConnects {
	expressID:number=1441486842;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingPositioningElement: (Reference<IfcPositioningElement> | IfcPositioningElement) , public RelatedProducts: (Reference<IfcProduct> | IfcProduct)[] )
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
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatedElements: IfcSpatialReferenceSelect[] , public RelatingStructure: (Reference<IfcSpatialElement> | IfcSpatialElement) )
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
export class IfcSectionedSolid extends IfcSolidModel {
	expressID:number=1862484736;
	constructor(expressID: number, public Directrix: (Reference<IfcCurve> | IfcCurve) , public CrossSections: (Reference<IfcProfileDef> | IfcProfileDef)[] )
	{
			super(expressID);
	}
}
export class IfcSectionedSolidHorizontal extends IfcSectionedSolid {
	expressID:number=1290935644;
	constructor(expressID: number, public Directrix: (Reference<IfcCurve> | IfcCurve) , public CrossSections: (Reference<IfcProfileDef> | IfcProfileDef)[] , public CrossSectionPositions: (Reference<IfcAxis2PlacementLinear> | IfcAxis2PlacementLinear)[] )
	{
		super(expressID,Directrix, CrossSections);
	}
}
export class IfcSectionedSurface extends IfcSurface {
	expressID:number=1356537516;
	constructor(expressID: number, public Directrix: (Reference<IfcCurve> | IfcCurve) , public CrossSectionPositions: (Reference<IfcAxis2PlacementLinear> | IfcAxis2PlacementLinear)[] , public CrossSections: (Reference<IfcProfileDef> | IfcProfileDef)[] )
	{
			super(expressID);
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
	IsInterferedByElements!: (Reference<IfcRelInterferesElements> | IfcRelInterferesElements)[] | null;
	InterferesElements!: (Reference<IfcRelInterferesElements> | IfcRelInterferesElements)[] | null;
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
export class IfcSpiral extends IfcCurve {
	expressID:number=2735484536;
	constructor(expressID: number, public Position: IfcAxis2Placement | null)
	{
			super(expressID);
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
export class IfcSurfaceCurveSweptAreaSolid extends IfcDirectrixCurveSweptAreaSolid {
	expressID:number=2028607225;
	constructor(expressID: number, public SweptArea: (Reference<IfcProfileDef> | IfcProfileDef) , public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) | null, public Directrix: (Reference<IfcCurve> | IfcCurve) , public StartParam: IfcCurveMeasureSelect | null, public EndParam: IfcCurveMeasureSelect | null, public ReferenceSurface: (Reference<IfcSurface> | IfcSurface) )
	{
		super(expressID,SweptArea, Position, Directrix, StartParam, EndParam);
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
	constructor(expressID: number, public Coordinates: (Reference<IfcCartesianPointList3D> | IfcCartesianPointList3D) , public Closed: IfcBoolean | null)
	{
			super(expressID);
	}
}
export class IfcThirdOrderPolynomialSpiral extends IfcSpiral {
	expressID:number=782932809;
	constructor(expressID: number, public Position: IfcAxis2Placement | null, public CubicTerm: IfcLengthMeasure , public QuadraticTerm: IfcLengthMeasure | null, public LinearTerm: IfcLengthMeasure | null, public ConstantTerm: IfcLengthMeasure | null)
	{
		super(expressID,Position);
	}
}
export class IfcToroidalSurface extends IfcElementarySurface {
	expressID:number=1935646853;
	constructor(expressID: number, public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) , public MajorRadius: IfcPositiveLengthMeasure , public MinorRadius: IfcPositiveLengthMeasure )
	{
		super(expressID,Position);
	}
}
export class IfcTransportationDeviceType extends IfcElementType {
	expressID:number=3665877780;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcTriangulatedFaceSet extends IfcTessellatedFaceSet {
	expressID:number=2916149573;
	constructor(expressID: number, public Coordinates: (Reference<IfcCartesianPointList3D> | IfcCartesianPointList3D) , public Closed: IfcBoolean | null, public Normals: IfcParameterValue[] | null, public CoordIndex: IfcPositiveInteger[] , public PnIndex: IfcPositiveInteger[] | null)
	{
		super(expressID,Coordinates, Closed);
	}
}
export class IfcTriangulatedIrregularNetwork extends IfcTriangulatedFaceSet {
	expressID:number=1229763772;
	constructor(expressID: number, public Coordinates: (Reference<IfcCartesianPointList3D> | IfcCartesianPointList3D) , public Closed: IfcBoolean | null, public Normals: IfcParameterValue[] | null, public CoordIndex: IfcPositiveInteger[] , public PnIndex: IfcPositiveInteger[] | null, public Flags: IfcInteger[] )
	{
		super(expressID,Coordinates, Closed, Normals, CoordIndex, PnIndex);
	}
}
export class IfcVehicleType extends IfcTransportationDeviceType {
	expressID:number=3651464721;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcVehicleTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
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
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public PredefinedType: IfcAnnotationTypeEnum | null)
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
export class IfcBuildingStorey extends IfcSpatialStructureElement {
	expressID:number=3124254112;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public CompositionType: IfcElementCompositionEnum | null, public Elevation: IfcLengthMeasure | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName, CompositionType);
	}
}
export class IfcBuiltElementType extends IfcElementType {
	expressID:number=1626504194;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcChimneyType extends IfcBuiltElementType {
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
export class IfcClothoid extends IfcSpiral {
	expressID:number=3497074424;
	constructor(expressID: number, public Position: IfcAxis2Placement | null, public ClothoidConstant: IfcLengthMeasure )
	{
		super(expressID,Position);
	}
}
export class IfcColumnType extends IfcBuiltElementType {
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
	constructor(expressID: number, public Segments: (Reference<IfcSegment> | IfcSegment)[] , public SelfIntersect: IfcLogical )
	{
			super(expressID);
	}
}
export class IfcCompositeCurveOnSurface extends IfcCompositeCurve {
	expressID:number=15328376;
	constructor(expressID: number, public Segments: (Reference<IfcSegment> | IfcSegment)[] , public SelfIntersect: IfcLogical )
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
export class IfcCosineSpiral extends IfcSpiral {
	expressID:number=2000195564;
	constructor(expressID: number, public Position: IfcAxis2Placement | null, public CosineTerm: IfcLengthMeasure , public ConstantTerm: IfcLengthMeasure | null)
	{
		super(expressID,Position);
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
export class IfcCourseType extends IfcBuiltElementType {
	expressID:number=4189326743;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcCourseTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcCoveringType extends IfcBuiltElementType {
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
export class IfcCurtainWallType extends IfcBuiltElementType {
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
export class IfcDeepFoundationType extends IfcBuiltElementType {
	expressID:number=1306400036;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcDirectrixDerivedReferenceSweptAreaSolid extends IfcFixedReferenceSweptAreaSolid {
	expressID:number=4234616927;
	constructor(expressID: number, public SweptArea: (Reference<IfcProfileDef> | IfcProfileDef) , public Position: (Reference<IfcAxis2Placement3D> | IfcAxis2Placement3D) | null, public Directrix: (Reference<IfcCurve> | IfcCurve) , public StartParam: IfcCurveMeasureSelect | null, public EndParam: IfcCurveMeasureSelect | null, public FixedReference: (Reference<IfcDirection> | IfcDirection) )
	{
		super(expressID,SweptArea, Position, Directrix, StartParam, EndParam, FixedReference);
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
export class IfcDoorType extends IfcBuiltElementType {
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
	HasOpenings!: (Reference<IfcRelVoidsElement> | IfcRelVoidsElement)[] | null;
	IsConnectionRealization!: (Reference<IfcRelConnectsWithRealizingElements> | IfcRelConnectsWithRealizingElements)[] | null;
	ProvidesBoundaries!: (Reference<IfcRelSpaceBoundary> | IfcRelSpaceBoundary)[] | null;
	ConnectedFrom!: (Reference<IfcRelConnectsElements> | IfcRelConnectsElements)[] | null;
	ContainedInStructure!: (Reference<IfcRelContainedInSpatialStructure> | IfcRelContainedInSpatialStructure)[] | null;
	HasCoverings!: (Reference<IfcRelCoversBldgElements> | IfcRelCoversBldgElements)[] | null;
	HasSurfaceFeatures!: (Reference<IfcRelAdheresToElement> | IfcRelAdheresToElement)[] | null;
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
export class IfcFacility extends IfcSpatialStructureElement {
	expressID:number=24185140;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public CompositionType: IfcElementCompositionEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName, CompositionType);
	}
}
export class IfcFacilityPart extends IfcSpatialStructureElement {
	expressID:number=1310830890;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public CompositionType: IfcElementCompositionEnum | null, public UsageType: IfcFacilityUsageEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName, CompositionType);
	}
}
export class IfcFacilityPartCommon extends IfcFacilityPart {
	expressID:number=4228831410;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public CompositionType: IfcElementCompositionEnum | null, public UsageType: IfcFacilityUsageEnum , public PredefinedType: IfcFacilityPartCommonTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName, CompositionType, UsageType);
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
export class IfcFootingType extends IfcBuiltElementType {
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
export class IfcGeotechnicalElement extends IfcElement {
	expressID:number=4230923436;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcGeotechnicalStratum extends IfcGeotechnicalElement {
	expressID:number=1594536857;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcGeotechnicalStratumTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcGradientCurve extends IfcCompositeCurve {
	expressID:number=2898700619;
	constructor(expressID: number, public Segments: (Reference<IfcSegment> | IfcSegment)[] , public SelfIntersect: IfcLogical , public BaseCurve: (Reference<IfcBoundedCurve> | IfcBoundedCurve) , public EndPoint: (Reference<IfcPlacement> | IfcPlacement) | null)
	{
		super(expressID,Segments, SelfIntersect);
	}
}
export class IfcGroup extends IfcObject {
	expressID:number=2706460486;
	IsGroupedBy!: (Reference<IfcRelAssignsToGroup> | IfcRelAssignsToGroup)[] | null;
	ReferencedInStructures!: (Reference<IfcRelReferencedInSpatialStructure> | IfcRelReferencedInSpatialStructure)[] | null;
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
export class IfcImpactProtectionDevice extends IfcElementComponent {
	expressID:number=2568555532;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcImpactProtectionDeviceTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcImpactProtectionDeviceType extends IfcElementComponentType {
	expressID:number=3948183225;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcImpactProtectionDeviceTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcIndexedPolyCurve extends IfcBoundedCurve {
	expressID:number=2571569899;
	constructor(expressID: number, public Points: (Reference<IfcCartesianPointList> | IfcCartesianPointList) , public Segments: IfcSegmentIndexSelect[] | null, public SelfIntersect: IfcLogical )
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
export class IfcKerbType extends IfcBuiltElementType {
	expressID:number=679976338;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public Mountable: IfcBoolean )
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
export class IfcLinearElement extends IfcProduct {
	expressID:number=2176059722;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcLiquidTerminalType extends IfcFlowTerminalType {
	expressID:number=1770583370;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcLiquidTerminalTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcMarineFacility extends IfcFacility {
	expressID:number=525669439;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public CompositionType: IfcElementCompositionEnum | null, public PredefinedType: IfcMarineFacilityTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName, CompositionType);
	}
}
export class IfcMarinePart extends IfcFacilityPart {
	expressID:number=976884017;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public CompositionType: IfcElementCompositionEnum | null, public UsageType: IfcFacilityUsageEnum , public PredefinedType: IfcMarinePartTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName, CompositionType, UsageType);
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
export class IfcMemberType extends IfcBuiltElementType {
	expressID:number=3181161470;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcMemberTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcMobileTelecommunicationsApplianceType extends IfcFlowTerminalType {
	expressID:number=1950438474;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcMobileTelecommunicationsApplianceTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcMooringDeviceType extends IfcBuiltElementType {
	expressID:number=710110818;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcMooringDeviceTypeEnum )
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
export class IfcNavigationElementType extends IfcBuiltElementType {
	expressID:number=506776471;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcNavigationElementTypeEnum )
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
export class IfcOutletType extends IfcFlowTerminalType {
	expressID:number=2837617999;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcOutletTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcPavementType extends IfcBuiltElementType {
	expressID:number=514975943;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcPavementTypeEnum )
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
export class IfcPileType extends IfcDeepFoundationType {
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
export class IfcPlateType extends IfcBuiltElementType {
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
		super(expressID,Coordinates, Closed);
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
export class IfcPositioningElement extends IfcProduct {
	expressID:number=1946335990;
	ContainedInStructure!: (Reference<IfcRelContainedInSpatialStructure> | IfcRelContainedInSpatialStructure)[] | null;
	Positions!: (Reference<IfcRelPositions> | IfcRelPositions)[] | null;
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
export class IfcRailType extends IfcBuiltElementType {
	expressID:number=1763565496;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcRailTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcRailingType extends IfcBuiltElementType {
	expressID:number=2893384427;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcRailingTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcRailway extends IfcFacility {
	expressID:number=3992365140;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public CompositionType: IfcElementCompositionEnum | null, public PredefinedType: IfcRailwayTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName, CompositionType);
	}
}
export class IfcRailwayPart extends IfcFacilityPart {
	expressID:number=1891881377;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public CompositionType: IfcElementCompositionEnum | null, public UsageType: IfcFacilityUsageEnum , public PredefinedType: IfcRailwayPartTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName, CompositionType, UsageType);
	}
}
export class IfcRampFlightType extends IfcBuiltElementType {
	expressID:number=2324767716;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcRampFlightTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcRampType extends IfcBuiltElementType {
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
export class IfcReferent extends IfcPositioningElement {
	expressID:number=4021432810;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public PredefinedType: IfcReferentTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
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
export class IfcRelAdheresToElement extends IfcRelDecomposes {
	expressID:number=3818125796;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingElement: (Reference<IfcElement> | IfcElement) , public RelatedSurfaceFeatures: (Reference<IfcSurfaceFeature> | IfcSurfaceFeature)[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRelAggregates extends IfcRelDecomposes {
	expressID:number=160246688;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public RelatingObject: (Reference<IfcObjectDefinition> | IfcObjectDefinition) , public RelatedObjects: (Reference<IfcObjectDefinition> | IfcObjectDefinition)[] )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description);
	}
}
export class IfcRoad extends IfcFacility {
	expressID:number=146592293;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public CompositionType: IfcElementCompositionEnum | null, public PredefinedType: IfcRoadTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName, CompositionType);
	}
}
export class IfcRoadPart extends IfcFacilityPart {
	expressID:number=550521510;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public CompositionType: IfcElementCompositionEnum | null, public UsageType: IfcFacilityUsageEnum , public PredefinedType: IfcRoadPartTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName, CompositionType, UsageType);
	}
}
export class IfcRoofType extends IfcBuiltElementType {
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
export class IfcSecondOrderPolynomialSpiral extends IfcSpiral {
	expressID:number=3649235739;
	constructor(expressID: number, public Position: IfcAxis2Placement | null, public QuadraticTerm: IfcLengthMeasure , public LinearTerm: IfcLengthMeasure | null, public ConstantTerm: IfcLengthMeasure | null)
	{
		super(expressID,Position);
	}
}
export class IfcSegmentedReferenceCurve extends IfcCompositeCurve {
	expressID:number=544395925;
	constructor(expressID: number, public Segments: (Reference<IfcSegment> | IfcSegment)[] , public SelfIntersect: IfcLogical , public BaseCurve: (Reference<IfcBoundedCurve> | IfcBoundedCurve) , public EndPoint: (Reference<IfcPlacement> | IfcPlacement) | null)
	{
		super(expressID,Segments, SelfIntersect);
	}
}
export class IfcSeventhOrderPolynomialSpiral extends IfcSpiral {
	expressID:number=1027922057;
	constructor(expressID: number, public Position: IfcAxis2Placement | null, public SepticTerm: IfcLengthMeasure , public SexticTerm: IfcLengthMeasure | null, public QuinticTerm: IfcLengthMeasure | null, public QuarticTerm: IfcLengthMeasure | null, public CubicTerm: IfcLengthMeasure | null, public QuadraticTerm: IfcLengthMeasure | null, public LinearTerm: IfcLengthMeasure | null, public ConstantTerm: IfcLengthMeasure | null)
	{
		super(expressID,Position);
	}
}
export class IfcShadingDeviceType extends IfcBuiltElementType {
	expressID:number=4074543187;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcShadingDeviceTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcSign extends IfcElementComponent {
	expressID:number=33720170;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcSignTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcSignType extends IfcElementComponentType {
	expressID:number=3599934289;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcSignTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcSignalType extends IfcFlowTerminalType {
	expressID:number=1894708472;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcSignalTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcSineSpiral extends IfcSpiral {
	expressID:number=42703149;
	constructor(expressID: number, public Position: IfcAxis2Placement | null, public SineTerm: IfcLengthMeasure , public LinearTerm: IfcLengthMeasure | null, public ConstantTerm: IfcLengthMeasure | null)
	{
		super(expressID,Position);
	}
}
export class IfcSite extends IfcSpatialStructureElement {
	expressID:number=4097777520;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public CompositionType: IfcElementCompositionEnum | null, public RefLatitude: IfcCompoundPlaneAngleMeasure | null, public RefLongitude: IfcCompoundPlaneAngleMeasure | null, public RefElevation: IfcLengthMeasure | null, public LandTitleNumber: IfcLabel | null, public SiteAddress: (Reference<IfcPostalAddress> | IfcPostalAddress) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName, CompositionType);
	}
}
export class IfcSlabType extends IfcBuiltElementType {
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
export class IfcStairFlightType extends IfcBuiltElementType {
	expressID:number=1039846685;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcStairFlightTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcStairType extends IfcBuiltElementType {
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
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public AppliedCondition: (Reference<IfcBoundaryCondition> | IfcBoundaryCondition) | null, public AxisDirection: (Reference<IfcDirection> | IfcDirection) )
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
	AdheresToElement!: (Reference<IfcRelAdheresToElement> | IfcRelAdheresToElement) | null;
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
	ServicesFacilities!: (Reference<IfcRelReferencedInSpatialStructure> | IfcRelReferencedInSpatialStructure)[] | null;
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
export class IfcTendonConduit extends IfcReinforcingElement {
	expressID:number=3663046924;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public SteelGrade: IfcLabel | null, public PredefinedType: IfcTendonConduitTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag, SteelGrade);
	}
}
export class IfcTendonConduitType extends IfcReinforcingElementType {
	expressID:number=2281632017;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcTendonConduitTypeEnum )
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
export class IfcTrackElementType extends IfcBuiltElementType {
	expressID:number=618700268;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcTrackElementTypeEnum )
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
export class IfcTransportElementType extends IfcTransportationDeviceType {
	expressID:number=2097647324;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcTransportElementTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcTransportationDevice extends IfcElement {
	expressID:number=1953115116;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
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
export class IfcVehicle extends IfcTransportationDevice {
	expressID:number=840318589;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcVehicleTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcVibrationDamper extends IfcElementComponent {
	expressID:number=1530820697;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcDamperTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcVibrationDamperType extends IfcElementComponentType {
	expressID:number=3956297820;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcVibrationDamperTypeEnum )
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
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcVirtualElementTypeEnum | null)
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
export class IfcWallType extends IfcBuiltElementType {
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
export class IfcWindowType extends IfcBuiltElementType {
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
export class IfcAlignmentCant extends IfcLinearElement {
	expressID:number=4266260250;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public RailHeadDistance: IfcPositiveLengthMeasure )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcAlignmentHorizontal extends IfcLinearElement {
	expressID:number=1545765605;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcAlignmentSegment extends IfcLinearElement {
	expressID:number=317615605;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public DesignParameters: (Reference<IfcAlignmentParameterSegment> | IfcAlignmentParameterSegment) )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcAlignmentVertical extends IfcLinearElement {
	expressID:number=1662888072;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
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
export class IfcBeamType extends IfcBuiltElementType {
	expressID:number=819618141;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcBeamTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
	}
}
export class IfcBearingType extends IfcBuiltElementType {
	expressID:number=3649138523;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcBearingTypeEnum )
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
	constructor(expressID: number, public Segments: (Reference<IfcSegment> | IfcSegment)[] , public SelfIntersect: IfcLogical )
	{
		super(expressID,Segments, SelfIntersect);
	}
}
export class IfcBridge extends IfcFacility {
	expressID:number=644574406;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public CompositionType: IfcElementCompositionEnum | null, public PredefinedType: IfcBridgeTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName, CompositionType);
	}
}
export class IfcBridgePart extends IfcFacilityPart {
	expressID:number=963979645;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public CompositionType: IfcElementCompositionEnum | null, public UsageType: IfcFacilityUsageEnum , public PredefinedType: IfcBridgePartTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName, CompositionType, UsageType);
	}
}
export class IfcBuilding extends IfcFacility {
	expressID:number=4031249490;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public LongName: IfcLabel | null, public CompositionType: IfcElementCompositionEnum | null, public ElevationOfRefHeight: IfcLengthMeasure | null, public ElevationOfTerrain: IfcLengthMeasure | null, public BuildingAddress: (Reference<IfcPostalAddress> | IfcPostalAddress) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, LongName, CompositionType);
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
export class IfcBuildingElementProxyType extends IfcBuiltElementType {
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
export class IfcBuiltElement extends IfcElement {
	expressID:number=1876633798;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcBuiltSystem extends IfcSystem {
	expressID:number=3862327254;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public PredefinedType: IfcBuiltSystemTypeEnum | null, public LongName: IfcLabel | null)
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
export class IfcCaissonFoundationType extends IfcDeepFoundationType {
	expressID:number=3203706013;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcCaissonFoundationTypeEnum )
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
export class IfcChimney extends IfcBuiltElement {
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
export class IfcColumn extends IfcBuiltElement {
	expressID:number=843113511;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcColumnTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
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
export class IfcConveyorSegmentType extends IfcFlowSegmentType {
	expressID:number=2940368186;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcConveyorSegmentTypeEnum )
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ApplicableOccurrence, HasPropertySets, RepresentationMaps, Tag, ElementType);
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
export class IfcCourse extends IfcBuiltElement {
	expressID:number=1502416096;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcCourseTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcCovering extends IfcBuiltElement {
	expressID:number=1973544240;
	CoversSpaces!: (Reference<IfcRelCoversSpaces> | IfcRelCoversSpaces)[] | null;
	CoversElements!: (Reference<IfcRelCoversBldgElements> | IfcRelCoversBldgElements)[] | null;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcCoveringTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcCurtainWall extends IfcBuiltElement {
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
export class IfcDeepFoundation extends IfcBuiltElement {
	expressID:number=3426335179;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
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
export class IfcDistributionBoardType extends IfcFlowControllerType {
	expressID:number=479945903;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcDistributionBoardTypeEnum )
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
export class IfcDoor extends IfcBuiltElement {
	expressID:number=395920057;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public OverallHeight: IfcPositiveLengthMeasure | null, public OverallWidth: IfcPositiveLengthMeasure | null, public PredefinedType: IfcDoorTypeEnum | null, public OperationType: IfcDoorTypeOperationEnum | null, public UserDefinedOperationType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
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
export class IfcEarthworksCut extends IfcFeatureElementSubtraction {
	expressID:number=3071239417;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcEarthworksCutTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcEarthworksElement extends IfcBuiltElement {
	expressID:number=1077100507;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcEarthworksFill extends IfcEarthworksElement {
	expressID:number=3376911765;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcEarthworksFillTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
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
export class IfcElectricFlowTreatmentDeviceType extends IfcFlowTreatmentDeviceType {
	expressID:number=2142170206;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ApplicableOccurrence: IfcIdentifier | null, public HasPropertySets: (Reference<IfcPropertySetDefinition> | IfcPropertySetDefinition)[] | null, public RepresentationMaps: (Reference<IfcRepresentationMap> | IfcRepresentationMap)[] | null, public Tag: IfcLabel | null, public ElementType: IfcLabel | null, public PredefinedType: IfcElectricFlowTreatmentDeviceTypeEnum )
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
export class IfcFooting extends IfcBuiltElement {
	expressID:number=900683007;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcFootingTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcGeotechnicalAssembly extends IfcGeotechnicalElement {
	expressID:number=2713699986;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcGrid extends IfcPositioningElement {
	expressID:number=3009204131;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public UAxes: (Reference<IfcGridAxis> | IfcGridAxis)[] , public VAxes: (Reference<IfcGridAxis> | IfcGridAxis)[] , public WAxes: (Reference<IfcGridAxis> | IfcGridAxis)[] | null, public PredefinedType: IfcGridTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
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
export class IfcKerb extends IfcBuiltElement {
	expressID:number=2696325953;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public Mountable: IfcBoolean )
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
export class IfcLinearPositioningElement extends IfcPositioningElement {
	expressID:number=1154579445;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcLiquidTerminal extends IfcFlowTerminal {
	expressID:number=1638804497;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcLiquidTerminalTypeEnum | null)
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
export class IfcMember extends IfcBuiltElement {
	expressID:number=1073191201;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcMemberTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcMobileTelecommunicationsAppliance extends IfcFlowTerminal {
	expressID:number=2078563270;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcMobileTelecommunicationsApplianceTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcMooringDevice extends IfcBuiltElement {
	expressID:number=234836483;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcMooringDeviceTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcMotorConnection extends IfcEnergyConversionDevice {
	expressID:number=2474470126;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcMotorConnectionTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcNavigationElement extends IfcBuiltElement {
	expressID:number=2182337498;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcNavigationElementTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcOuterBoundaryCurve extends IfcBoundaryCurve {
	expressID:number=144952367;
	constructor(expressID: number, public Segments: (Reference<IfcSegment> | IfcSegment)[] , public SelfIntersect: IfcLogical )
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
export class IfcPavement extends IfcBuiltElement {
	expressID:number=1383356374;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcPavementTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcPile extends IfcDeepFoundation {
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
export class IfcPlate extends IfcBuiltElement {
	expressID:number=3171933400;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcPlateTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
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
export class IfcRail extends IfcBuiltElement {
	expressID:number=3290496277;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcRailTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcRailing extends IfcBuiltElement {
	expressID:number=2262370178;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcRailingTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcRamp extends IfcBuiltElement {
	expressID:number=3024970846;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcRampTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcRampFlight extends IfcBuiltElement {
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
export class IfcReinforcedSoil extends IfcEarthworksElement {
	expressID:number=3798194928;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcReinforcedSoilTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
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
export class IfcRoof extends IfcBuiltElement {
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
export class IfcShadingDevice extends IfcBuiltElement {
	expressID:number=1329646415;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcShadingDeviceTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcSignal extends IfcFlowTerminal {
	expressID:number=991950508;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcSignalTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcSlab extends IfcBuiltElement {
	expressID:number=1529196076;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcSlabTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
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
export class IfcStair extends IfcBuiltElement {
	expressID:number=331165859;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcStairTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcStairFlight extends IfcBuiltElement {
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
export class IfcTrackElement extends IfcBuiltElement {
	expressID:number=3425753595;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcTrackElementTypeEnum | null)
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
export class IfcTransportElement extends IfcTransportationDevice {
	expressID:number=1620046519;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcTransportElementTypeEnum | null)
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
export class IfcWall extends IfcBuiltElement {
	expressID:number=2391406946;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcWallTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
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
export class IfcWindow extends IfcBuiltElement {
	expressID:number=3304561284;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public OverallHeight: IfcPositiveLengthMeasure | null, public OverallWidth: IfcPositiveLengthMeasure | null, public PredefinedType: IfcWindowTypeEnum | null, public PartitioningType: IfcWindowTypePartitioningEnum | null, public UserDefinedPartitioningType: IfcLabel | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
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
export class IfcAlignment extends IfcLinearPositioningElement {
	expressID:number=325726236;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public PredefinedType: IfcAlignmentTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation);
	}
}
export class IfcAudioVisualAppliance extends IfcFlowTerminal {
	expressID:number=277319702;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcAudioVisualApplianceTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcBeam extends IfcBuiltElement {
	expressID:number=753842376;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcBeamTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcBearing extends IfcBuiltElement {
	expressID:number=4196446775;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcBearingTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcBoiler extends IfcEnergyConversionDevice {
	expressID:number=32344328;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcBoilerTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcBorehole extends IfcGeotechnicalAssembly {
	expressID:number=3314249567;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcBuildingElementProxy extends IfcBuiltElement {
	expressID:number=1095909175;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcBuildingElementProxyTypeEnum | null)
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
export class IfcCaissonFoundation extends IfcDeepFoundation {
	expressID:number=3999819293;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcCaissonFoundationTypeEnum | null)
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
export class IfcConveyorSegment extends IfcFlowSegment {
	expressID:number=3460952963;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcConveyorSegmentTypeEnum | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
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
export class IfcDistributionBoard extends IfcFlowController {
	expressID:number=3693000487;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcDistributionBoardTypeEnum | null)
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
export class IfcElectricFlowTreatmentDevice extends IfcFlowTreatmentDevice {
	expressID:number=24726584;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null, public PredefinedType: IfcElectricFlowTreatmentDeviceTypeEnum | null)
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
export class IfcGeomodel extends IfcGeotechnicalAssembly {
	expressID:number=2680139844;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
	{
		super(expressID,GlobalId, OwnerHistory, Name, Description, ObjectType, ObjectPlacement, Representation, Tag);
	}
}
export class IfcGeoslice extends IfcGeotechnicalAssembly {
	expressID:number=1971632696;
	constructor(expressID: number, public GlobalId: IfcGloballyUniqueId , public OwnerHistory: (Reference<IfcOwnerHistory> | IfcOwnerHistory) | null, public Name: IfcLabel | null, public Description: IfcText | null, public ObjectType: IfcLabel | null, public ObjectPlacement: (Reference<IfcObjectPlacement> | IfcObjectPlacement) | null, public Representation: (Reference<IfcProductRepresentation> | IfcProductRepresentation) | null, public Tag: IfcIdentifier | null)
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