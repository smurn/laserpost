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
    groupLightBurn: {
      title: localize('LightBurn file settings'),
      description: localize('Settings to customize the generated .lbrn file.'),
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
    // Group: groupLightBurn
    //
    lightburn0200IncludeComments: {
      title: localize('Comments'),
      description: localize(
        'Detail level of XML comments in the generated ".lbrn" file.'
      ),
      group: 'groupLightBurn',
      type: 'enum',
      values: [
        { title: localize('Disable'), id: INCLUDE_COMMENTS_NONE },
        { title: localize('Normal'), id: INCLUDE_COMMENTS_NORMAL },
        { title: localize('Detailed'), id: INCLUDE_COMMENTS_DETAILED },
        { title: localize('Debug'), id: INCLUDE_COMMENTS_DEBUG },
        { title: localize('Insane'), id: INCLUDE_COMMENTS_INSANE },
      ],
      value: INCLUDE_COMMENTS_NORMAL,
      scope: 'post',
    },
    lightburn0500GroupOperations: {
      title: localize('Group operations'),
      description: localize(
        'Set if a group should be created around all operations that share the same layer.  Groups are only created if there is more than one operation in the layer.'
      ),
      group: 'groupLightBurn',
      type: 'boolean',
      value: true,
      scope: 'post',
    },
    lightburn0600GroupShapes: {
      title: localize('Group shapes'),
      description: localize(
        'Set if a group should be created around all shapes generated by a single operation.  Groups are only created if there is more than one shape in the operation.'
      ),
      group: 'groupLightBurn',
      type: 'boolean',
      value: true,
      scope: 'post',
    },
    //
    // Group: groupWorkspace
    //
    work0100TraceStock: {
      title: localize('Trace stock'),
      description: localize(
        'Includes vectors on a custom layer (with output off) that traces the outline of the stock.'
      ),
      group: 'groupWorkspace',
      type: 'boolean',
      value: true,
      scope: 'post',
    },
    work0200OffsetX: {
      title: localize('Offset X axis'),
      description: localize(
        'Sets an optional X offset (in mm) to move all geometry in the workspace.  Positive and negative numbers are allowed.'
      ),
      group: 'groupWorkspace',
      type: 'number',
      value: 0,
      scope: 'post',
    },
    work0300OffsetX: {
      title: localize('Offset Y axis'),
      description: localize(
        'Sets an optional Y offset (in mm) to move all geometry in the workspace.  Positive and negative numbers are allowed.'
      ),
      group: 'groupWorkspace',
      type: 'number',
      value: 0,
      scope: 'post',
    },
    //
    // Group: groupLaserPower
    //
    laserPower0100EtchMin: {
      title: localize('Etch power (min, %)'),
      description: localize(
        'Sets the mininum laser power used for etching (ignored if etch max power is 0).'
      ),
      group: 'groupLaserPower',
      type: 'number',
      value: 0,
      range: [0, 100],
      scope: 'post',
    },
    laserPower0200EtchMax: {
      title: localize('Etch power (max, %)'),
      description: localize(
        "Sets the maximum laser power used for etching ('0' to use power specified on the tool)."
      ),
      group: 'groupLaserPower',
      type: 'number',
      value: 0,
      range: [0, 100],
      scope: 'post',
    },
    laserPower0300VaporizeMin: {
      title: localize('Vaporize power (min, %)'),
      description: localize(
        'Sets the minimum laser power used for vaporize (ignored if vaporize max power is 0).'
      ),
      group: 'groupLaserPower',
      type: 'number',
      value: 0,
      range: [0, 100],
      scope: 'post',
    },
    laserPower0400VaporizeMax: {
      title: localize('Vaporize power (max, %)'),
      description: localize(
        "Sets the maximum laser power used for vaporize ('0' to use power specified on the tool)."
      ),
      group: 'groupLaserPower',
      type: 'number',
      value: 0,
      range: [0, 100],
      scope: 'post',
    },
    laserPower0500ThroughMin: {
      title: localize('Through power (min, %)'),
      description: localize(
        'Sets the minimum laser power used for through cutting (ignored if through max power is 0)).'
      ),
      group: 'groupLaserPower',
      type: 'number',
      value: 0,
      range: [0, 100],
      scope: 'post',
    },
    laserPower0600ThroughMax: {
      title: localize('Through power (max, %)'),
      description: localize(
        "Sets the maximum laser power used for through cutting ('0' to use power specified on the tool)."
      ),
      group: 'groupLaserPower',
      type: 'number',
      value: 0,
      range: [0, 100],
      scope: 'post',
    },
    //
    // machine: common machine settings
    //
    machine0100SpeedUnits: {
      title: localize('Speed units'),
      description: localize(
        'Speed units to use in comments and file notes (does not affect the actual file as LightBurn always uses mm/sec).'
      ),
      type: 'enum',
      values: [
        { title: localize('mm/sec'), id: SPEED_UNITS_MMPS },
        { title: localize('mm/min'), id: SPEED_UNITS_MMPM },
      ],
      value: SPEED_UNITS_MMPS,
      scope: 'machine',
    },
    machine0200IncludeNotes: {
      title: localize('Notes'),
      description: localize(
        'Detail level of Notes in the generated ".lbrn" file.'
      ),
      type: 'enum',
      values: [
        { title: localize('Disable'), id: INCLUDE_NOTES_NONE },
        { title: localize('Hidden'), id: INCLUDE_NOTES_HIDDEN },
        {
          title: localize('Show when important'),
          id: INCLUDE_NOTES_SHOW_IMPORTANT,
        },
        { title: localize('Show'), id: INCLUDE_NOTES_SHOW },
      ],
      value: INCLUDE_NOTES_SHOW_IMPORTANT,
      scope: 'machine',
    },
    machine0300AutomaticUpdate: {
      title: localize('Automatic update'),
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
      value: UPDATE_FREQUENCY_HOURLY, // todo: change to DAILY when at RC/STABLE
      scope: 'machine',
    },
    machine0400UpdateAllowBeta: {
      title: localize('Beta releases'),
      description: localize(
        'Enable to allow beta releases, disable for stable releases only.'
      ),
      type: 'boolean',
      value: true, // todo: change to false when at RC/STABLE
      scope: 'machine',
    },
  
    //
    // operation: cutting
    //
    op0100UseAir: {
      title: localize('Air assist'),
      description: localize(
        'Sets if the layer uses air.  "Off" / "On" always set the air to the specified state, "Tool Assist Gas" will set the air off when ' +
          'the tools "Cutting Data" (section "Process inputs") property "Assist gas" is "None" (or blank) and turn the air on for any other value.'
      ),
      type: 'enum',
      values: [
        { title: localize('Off'), id: USE_AIR_OFF },
        { title: localize('On'), id: USE_AIR_ON },
        { title: localize('Tool Assist Gas'), id: USE_AIR_ASSIST_GAS },
      ],
      value: USE_AIR_ASSIST_GAS,
      scope: 'operation',
      enabled: 'cutting',
    },
    op0200PowerScale: {
      title: localize('Power scale (%)'),
      description: localize(
        'LightBurn power scale (0-100%) for the shapes in the operation.'
      ),
      type: 'number',
      value: 100,
      range: [0, 100],
      scope: 'operation',
      enabled: 'cutting',
    },
    op0300ZOffset: {
      title: localize('Z-offset (mm)'),
      description: localize(
        'Amount to offset Z into the material (or out of it) at the start of cutting.  Useful for deep cutting or defocusing.'
      ),
      type: 'number',
      value: 0,
      scope: 'operation',
      enabled: 'cutting',
    },
    op0400Passes: {
      title: localize('Pass count'),
      description: localize('Number of times to repeat the cut.'),
      type: 'number',
      value: 1,
      scope: 'operation',
      enabled: 'cutting',
    },
    op0500ZStep: {
      title: localize('Z-step per pass (mm)'),
      description: localize('Amount of raise or lower Z for each cut pass.'),
      type: 'number',
      value: 0,
      scope: 'operation',
      enabled: 'cutting',
    },
    op0600LayerMode: {
      title: localize('Layer mode'),
      description: localize(
        'Selects the layer mode for the layer (Line, Fill or Offset Fill).  If a complex layer setup is needed, including for sub-layers (Multi), see the ' +
          'property "Custom CutSetting XML".'
      ),
      type: 'enum',
      values: [
        { title: localize('Line'), id: LAYER_MODE_LINE },
        { title: localize('Fill'), id: LAYER_MODE_FILL },
        { title: localize('Offset Fill'), id: LAYER_MODE_OFFSET_FILL },
      ],
      value: LAYER_MODE_LINE,
      scope: 'operation',
      enabled: 'cutting',
    },
    op0700LaserEnable: {
      title: localize('Laser enable'),
      description: localize(
        'Controls if the layer should be enabled and using which laser(s) (for dual laser machines).'
      ),
      type: 'enum',
      values: [
        { title: localize('Disable output'), id: LASER_ENABLE_OFF },
        { title: localize('Laser 1'), id: LASER_ENABLE_1 },
        { title: localize('Laser 2'), id: LASER_ENABLE_2 },
        { title: localize('Both lasers'), id: LASER_ENABLE_BOTH },
      ],
      value: LASER_ENABLE_1,
      scope: 'operation',
      enabled: 'cutting',
    },
    op0800GroupName: {
      title: localize('Grouping name'),
      description: localize(
        'By default, operations have their shapes group together (if there is more than one shape) but operations themselves are not grouped.  ' +
          'Operations that share the same "group name" will have their shapes grouped into a parent LightBurn group.  The name is used only to identify ' +
          'operations to group and is not part of the LightBurn grouping or layering.'
      ),
      type: 'string',
      value: '',
      scope: 'operation',
      enabled: 'cutting',
    },
    op0900CustomCutSettingXML: {
      title: localize('Custom CutSetting (XML)'),
      description: localize(
        'For complex LightBurn cut settings (such as using sub-layers or advanced options) you can paste the <CutSettings> section of the XML from a template ' +
          'LightBurn file (it does not matter if it is from lbrn or lbrn2).  Include everything from <CutSettings> through </CutSettings> (including those tags).'
      ),
      type: 'string',
      value: '',
      scope: 'operation',
      enabled: 'cutting',
    },
  };
  
  