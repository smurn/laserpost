/**************************************************************************************
 *
 * LaserPost module: camProperties.js
 *
 * CAM UI configuration
 *
 *************************************************************************************/

/**
 * Define the groups used for properties when displayed during CAM configuraiton in the CAM UI
 */
groupDefinitions = {
  groupLaserPost: {
    title: localize('LaserPost (VERSION_NUMBER) file settings'),
    description: localize('Settings to customize the generated files.'),
    collapsed: false,
    order: 20,
  },
  groupWorkspace: {
    title: localize('Workspace'),
    description: localize(
      'Adjust the workspace (or stock) settings, including X/Y offset and rendering of the stock boundries.'
    ),
    collapsed: true,
    order: 40,
  },
  groupLaserPower: {
    title: localize('Power overrides'),
    description: localize(
      'Laser power overrides to based on operation cutting type (etch, cut through and vaporize).'
    ),
    collapsed: true,
    order: 40,
  },
};

/**
 * Define the properties (often organized by the groups above) that users can control during CAM configuration.
 */
properties = {
  //
  // Group: groupLaserPost
  //
  laserpost0100Organization: {
    title: localize('Organization'),
    description: localize(
      'Determines if shapes be organized by operation (in one file), by layer (in one file), or by layer oer file (one file for each layer).'
    ),
    group: 'groupLaserPost',
    type: 'enum',
    values: [
      { title: localize('By operation'), id: ORGANIZATION_BY_OPERATION },
      { title: localize('By layer'), id: ORGANIZATION_BY_LAYER },
      { title: localize('By file per layer'), id: ORGANIZATION_BY_LAYER_FILE },
    ],
    value: GROUPING_DEFAULT,
    scope: 'post',
  },
  laserpost0200GroupShapes: {
    title: localize('Group shapes'),
    description: localize(
      'Set if a groups should be created around shapes (based on organization) or if all shapes should be ungrouped.'
    ),
    group: 'groupLaserPost',
    type: 'boolean',
    value: GROUP_SHAPES_DEFAULT,
    scope: 'post',
  },
  laserpost0300AlignmentMarks: {
    title: localize('Alignment marks'),
    description: localize(
      'Add alignment marks in a group/layer along the outside edge of the stock.  Useful when grouping is set to "File per layer" and the laser tool does not import shapes aligned to their original positions.'
    ),
    group: 'groupLaserPost',
    type: 'enum',
    values: [
      { title: localize('None'), id: ALIGNMENT_MARK_NONE },
      {
        title: localize('Aligned to stock upper-right'),
        id: ALIGNMENT_MARK_UPPER_RIGHT,
      },
      {
        title: localize('Aligned to stock center-right'),
        id: ALIGNMENT_MARK_CENTER_RIGHT,
      },
      {
        title: localize('Aligned to stock lower-right'),
        id: ALIGNMENT_MARK_LOWER_RIGHT,
      },
    ],
    value: ALIGNMENT_MARK_DEFAULT,
    scope: 'post',
  },
  laserpost0400IncludeNotes: {
    title: localize('Notes'),
    description: localize('Detail level of generated setup notes.'),
    group: 'groupLaserPost',
    type: 'enum',
    values: [
      { title: localize('Disable'), id: INCLUDE_NOTES_NONE },
      // #if LBRN
      { title: localize('Hidden'), id: INCLUDE_NOTES_HIDDEN },
      // #endif
      {
        title: localize('Show when important'),
        id: INCLUDE_NOTES_SHOW_IMPORTANT,
      },
      { title: localize('Always show'), id: INCLUDE_NOTES_SHOW },
    ],
    value: INCLUDE_NOTES_DEFAULT,
    scope: 'post',
  },
  laserpost0500IncludeComments: {
    title: localize('Comments'),
    description: localize('Detail level of comments in the generated files.'),
    group: 'groupLaserPost',
    type: 'enum',
    values: [
      { title: localize('Disable'), id: INCLUDE_COMMENTS_NONE },
      { title: localize('Normal'), id: INCLUDE_COMMENTS_NORMAL },
      { title: localize('Debug'), id: INCLUDE_COMMENTS_DEBUG },
      { title: localize('Insane'), id: INCLUDE_COMMENTS_INSANE },
    ],
    value: INCLUDE_COMMENTS_DEFAULT,
    scope: 'post',
  },
  //
  // Group: groupWorkspace
  //
  work0100TraceStock: {
    title: localize('Trace stock'),
    description: localize(
      'Includes a group/layer that traces the outline of the stock.'
    ),
    group: 'groupWorkspace',
    type: 'boolean',
    value: TRACE_STOCK_DEFAULT,
    scope: 'post',
  },
  work0200OffsetX: {
    title: localize('Offset X axis'),
    description: localize(
      'Sets an optional X offset (in mm) to move all geometry in the workspace.  Positive and negative numbers are allowed.'
    ),
    group: 'groupWorkspace',
    type: 'number',
    value: OFFSET_X_AXIS_DEFAULT,
    scope: 'post',
  },
  work0300OffsetY: {
    title: localize('Offset Y axis'),
    description: localize(
      'Sets an optional Y offset (in mm) to move all geometry in the workspace.  Positive and negative numbers are allowed.'
    ),
    group: 'groupWorkspace',
    type: 'number',
    value: OFFSET_Y_AXIS_DEFAULT,
    scope: 'post',
  },
  //
  // Group: groupLaserPower
  //
  laserPower0100EtchMin: {
    title: localize('Etch power (min, %)'),
    description: localize(
      'Overrides the mininum laser power used on etching cutting mode operations (ignored if etch max power is 0).'
    ),
    group: 'groupLaserPower',
    type: 'number',
    value: LASER_POWER_ETCH_MIN_DEFAULT,
    range: [0, 100],
    scope: 'post',
  },
  laserPower0200EtchMax: {
    title: localize('Etch power (max, %)'),
    description: localize(
      "Overrides the maximum laser power used on etching cutting mode operations ('0' to use power specified on the tool)."
    ),
    group: 'groupLaserPower',
    type: 'number',
    value: LASER_POWER_ETCH_MAX_DEFAULT,
    range: [0, 100],
    scope: 'post',
  },
  laserPower0300VaporizeMin: {
    title: localize('Vaporize power (min, %)'),
    description: localize(
      'Overrides the minimum laser power used on vaporize cutting mode operations (ignored if vaporize max power is 0).'
    ),
    group: 'groupLaserPower',
    type: 'number',
    value: LASER_POWER_VAPORIZE_MIN_DEFAULT,
    range: [0, 100],
    scope: 'post',
  },
  laserPower0400VaporizeMax: {
    title: localize('Vaporize power (max, %)'),
    description: localize(
      "Overrides the maximum laser power used on vaporize cutting mode operations ('0' to use power specified on the tool)."
    ),
    group: 'groupLaserPower',
    type: 'number',
    value: LASER_POWER_VAPORIZE_MAX_DEFAULT,
    range: [0, 100],
    scope: 'post',
  },
  laserPower0500ThroughMin: {
    title: localize('Through power (min, %)'),
    description: localize(
      'Overrides the minimum laser power used on through cutting cutting mode operations (ignored if through max power is 0)).'
    ),
    group: 'groupLaserPower',
    type: 'number',
    value: LASER_POWER_THROUGH_MIN_DEFAULT,
    range: [0, 100],
    scope: 'post',
  },
  laserPower0600ThroughMax: {
    title: localize('Through power (max, %)'),
    description: localize(
      "Overrides the maximum laser power used on through cutting cutting mode operations ('0' to use power specified on the tool)."
    ),
    group: 'groupLaserPower',
    type: 'number',
    value: LASER_POWER_THROUGH_MAX_DEFAULT,
    range: [0, 100],
    scope: 'post',
  },
  //
  // machine: common machine settings
  //
  // #if LBRN
  machine0050Orientation: {
    title: localize('Machine orientation'),
    description: localize(
      'Orientation of the home position on the physical laser machine.  Must match the LightBurn machine orientation.'
    ),
    type: 'enum',
    values: [
      { title: localize('Upper left'), id: MACHINE_ORIENTATION_UPPER_LEFT },
      { title: localize('Upper right'), id: MACHINE_ORIENTATION_UPPER_RIGHT },
      { title: localize('Lower left'), id: MACHINE_ORIENTATION_LOWER_LEFT },
      { title: localize('Lower right'), id: MACHINE_ORIENTATION_LOWER_RIGHT },
    ],
    value: MACHINE_ORIENTATION_DEFAULT,
    scope: 'machine',
  },
  // #endif
  machine0100SpeedUnits: {
    title: localize('Speed units'),
    description: localize(
      'Speed units to use in comments and setup notes (used in comments and setup sheets only, does not change operational behavior).'
    ),
    type: 'enum',
    values: [
      { title: localize('mm/sec'), id: SPEED_UNITS_MMPS },
      { title: localize('mm/min'), id: SPEED_UNITS_MMPM },
    ],
    value: SPEED_UNITS_DEFAULT,
    scope: 'machine',
  },
  machine0300AutomaticUpdate: {
    title: localize('Check for updates'),
    description: localize(
      'Set how often LaserPost should check and notify that updates are available.'
    ),
    type: 'enum',
    values: [
      { title: localize('Never'), id: UPDATE_FREQUENCY_NEVER },
      { title: localize('Always'), id: UPDATE_FREQUENCY_ALWAYS },
      { title: localize('Hourly'), id: UPDATE_FREQUENCY_HOURLY },
      { title: localize('Daily'), id: UPDATE_FREQUENCY_DAILY },
      { title: localize('Weekly'), id: UPDATE_FREQUENCY_WEEKLY },
      { title: localize('Monthly'), id: UPDATE_FREQUENCY_MONTHLY },
    ],
    value: UPDATE_FREQUENCY_DEFAULT,
    scope: 'machine',
  },
  machine0400UpdateAllowBeta: {
    title: localize('Beta releases'),
    description: localize(
      'Enable to allow for checking if beta release updates are available, disable for stable releases only.'
    ),
    type: 'boolean',
    value: UPDATE_ALLOW_BETA_DEFAULT,
    scope: 'machine',
  },
  // #if LBRN
  machine0500ShuttleLaser1: {
    title: localize('Mirror shuttle laser 1'),
    description: localize(
      'For machines that use a mirror shuttle to switch between lasers.  ' +
        'Leave empty if you do not have a mirror shuttle.  ' +
        'To use, specify the value to set the "U" axis to when laser 1 is selected.'
    ),
    type: 'string',
    value: SHUTTLE_LASER_1_DEFAULT,
    scope: 'machine',
  },
  machine0600ShuttleLaser2: {
    title: localize('Mirror shuttle laser 2'),
    description: localize(
      'For machines that use a mirror shuttle to switch between lasers.  ' +
        'Leave empty if you do not have a mirror shuttle.  ' +
        'To use, specify the value to set the "U" axis to when laser 2 is selected.'
    ),
    type: 'string',
    value: SHUTTLE_LASER_2_DEFAULT,
    scope: 'machine',
  },
  // #endif

  //
  // operation: cutting
  //
  op0100LayerMode: {
    title: localize('Layer mode'),
    description: localize(
      'Selects the layer mode for the layer (Use cutting mode, Line, Fill or Offset Fill).  Use cutting mode will set to Line for Through, and Fill for etch.'
    ),
    type: 'enum',
    values: [
      { title: localize('Use cutting mode'), id: LAYER_MODE_INHERIT },
      { title: localize('Line'), id: LAYER_MODE_LINE },
      { title: localize('Fill'), id: LAYER_MODE_FILL },
      { title: localize('Offset Fill'), id: LAYER_MODE_OFFSET_FILL },
    ],
    value: LAYER_MODE_DEFAULT,
    scope: 'operation',
    enabled: 'cutting',
  },
  op0200UseAir: {
    title: localize('Air assist'),
    description: localize(
      'Sets if the layer uses air.  "Off" / "On" always set the air to the specified state, "Tool Assist Gas" will set the air off when ' +
        'the tools "Cutting Data" (section "Process inputs") property "Assist gas" is "None" (or "off" or blank) and turn the air on for any other value.'
    ),
    type: 'enum',
    values: [
      { title: localize('Off'), id: USE_AIR_OFF },
      { title: localize('On'), id: USE_AIR_ON },
      { title: localize('Use tool setting'), id: USE_AIR_ASSIST_GAS },
    ],
    value: USE_AIR_DEFAULT,
    scope: 'operation',
    enabled: 'cutting',
  },
  op0300LaserEnable: {
    title: localize('Laser selection'),
    description: localize(
      'Controls if the layer should be enabled and using which laser(s) (for dual laser machines).'
    ),
    type: 'enum',
    values: [
      { title: localize('Use tool setting'), id: LASER_ENABLE_TOOL },
      { title: localize('Disable output'), id: LASER_ENABLE_OFF },
      { title: localize('Laser 1'), id: LASER_ENABLE_1 },
      { title: localize('Laser 2'), id: LASER_ENABLE_2 },
      { title: localize('Both lasers'), id: LASER_ENABLE_BOTH },
    ],
    value: LASER_ENABLE_DEFAULT,
    scope: 'operation',
    enabled: 'cutting',
  },
  op0400PowerScale: {
    title: localize('Power scale (%)'),
    description: localize(
      'Relative power scale (0-100%) for the shapes in the operation.'
    ),
    type: 'number',
    value: POWER_SCALE_DEFAULT,
    range: [0, 100],
    scope: 'operation',
    enabled: 'cutting',
  },
  op0500ZOffset: {
    title: localize('Z-offset (mm)'),
    description: localize(
      'Amount to offset Z into the material (or out of it) at the start of cutting.  Useful for deep cutting or defocusing.'
    ),
    type: 'number',
    value: Z_OFFSET_DEFAULT,
    scope: 'operation',
    enabled: 'cutting',
  },
  op0600Passes: {
    title: localize('Pass count'),
    description: localize('Number of times to repeat the cut.'),
    type: 'number',
    value: PASS_COUNT_DEFAULT,
    scope: 'operation',
    enabled: 'cutting',
  },
  op0700ZStep: {
    title: localize('Z-step per pass (mm)'),
    description: localize('Amount of raise or lower Z for each cut pass.'),
    type: 'number',
    value: Z_STEP_PER_PASS_DEFAULT,
    scope: 'operation',
    enabled: 'cutting',
  },
  op0800GroupName: {
    title: localize('Grouping name'),
    description: localize(
      'Operations that share the same "Grouping name" will have an additional group wrapped around them, ' +
        'in addition to any other groupings.  The name is used only to identify ' +
        'operations to group and is not part of the resulting generated files or laser setup.'
    ),
    type: 'string',
    value: GROUP_NAME_DEFAULT,
    scope: 'operation',
    enabled: 'cutting',
  },
  // #if LBRN
  op0900CustomCutSettingXML: {
    title: localize('Custom CutSetting (XML)'),
    description: localize(
      'For complex LightBurn cut settings (such as using sub-layers or advanced options) you can paste the <CutSettings> section of the XML from a template ' +
        'LightBurn file (it does not matter if it is from lbrn or lbrn2).  Include everything from <CutSettings> through </CutSettings> (including those tags).'
    ),
    type: 'string',
    value: CUSTOM_CUT_SETTING_XML_DEFAULT,
    scope: 'operation',
    enabled: 'cutting',
  },
  // #endif

  //
  // hidden settings, used by automated test
  //
  includeTimestamp: {
    title: 'Include timestamp',
    description:
      'Used by automated testing to disable inclusion of timestamp in generated files.',
    type: 'boolean',
    value: true,
    visible: false,
  },
  createImportantNote: {
    title: 'Create important note',
    description:
      'Used by automated testing to cause an important note to be generated.',
    type: 'boolean',
    value: false,
    visible: false,
  }
};
