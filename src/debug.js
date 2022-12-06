/**************************************************************************************
 *
 * LaserPost module: debug.js
 *
 * Debugging and simple UI support
 *
 *************************************************************************************/

/**
 * Display a simple warning message with a single OK button to continue.
 *
 * @param message Message that has been localized, with optional {arguments}
 * @param keyValue Object to resolve any {arguments} in message
 */
function showWarning(message, keyValue) {
  alert(
    format(localize('{description} ({version})'), {
      description: description,
      version: semVer,
    }),
    format(message, keyValue)
  );
}

/**
 * Dumps the contents of the groups (CAM based pathing) to comments in the file.
 */
function dumpGroups() {
  writeComment(
    'Dump: Groups ({groupCount} groups):',
    { groupCount: groups.length },
    COMMENT_DEBUG
  );
  for (let l = 0; l < groups.length; ++l) {
    const group = groups[l];

    writeComment(
      '  Group "{name}" ({opCount} operations)',
      {
        name: group.groupName ? group.groupName : '(none)',
        opCount: group.operations.length,
      },
      COMMENT_DEBUG
    );
    for (let o = 0; o < group.operations.length; ++o) {
      const operation = group.operations[o];

      writeComment(
        '    Operation "{name}" ({min}-{max}% power, power scale {powerScale}%, layer mode {layerMode} ({pathCount} paths)',
        {
          name: operation.operationName,
          min: operation.minPower,
          max: operation.maxPower,
          powerScale: operation.powerScale,
          layerMode: operation.layerMode,
          pathCount: operation.paths.length,
        },
        COMMENT_DEBUG
      );
      for (let p = 0; p < operation.paths.length; ++p) {
        const path = operation.paths[p];

        switch (path.type) {
          case PATH_TYPE_LINEAR:
            writeComment(
              '      Path #{pathId}: LINEAR [{x}, {y}] at {feed} mm/min',
              {
                pathId: p,
                x: formatPosition.format(path.x),
                y: formatPosition.format(path.y),
                feed: formatSpeed.format(path.feed),
              },
              COMMENT_INSANE
            );
            break;
          case PATH_TYPE_SEMICIRCLE:
          case PATH_TYPE_CIRCLE:
            writeComment(
              '      Path #{pathId}: {pathType} ({direction}) [{x}, {y}] centered on [{centerX}, {centerY}] at {feed} mm/min',
              {
                pathId: p,
                pathType:
                  path.type == PATH_TYPE_SEMICIRCLE ? 'SEMI-CIRCLE' : 'CIRCLE',
                centerX: formatPosition.format(path.centerX),
                centerY: formatPosition.format(path.centerY),
                x: formatPosition.format(path.x),
                y: formatPosition.format(path.y),
                direction: path.clockwise ? 'CW' : 'CCW',
                feed: formatSpeed.format(path.feed),
              },
              COMMENT_INSANE
            );
            break;
          case PATH_TYPE_MOVE:
            writeComment(
              '      Path #{pathId}: MOVE [{x}, {y}]',
              {
                pathId: p,
                x: formatPosition.format(path.x),
                y: formatPosition.format(path.y),
                feed: formatSpeed.format(path.feed),
              },
              COMMENT_INSANE
            );
            break;
        }
      }
    }
  }
}

/**
 * Dump the contents of the project (LightBurn style shapes) to comments in the file.
 */
function dumpProject() {
  // structure of the project object:
  // project.operationSets[{ shapeSets: {type: SHAPE_TYPE_*, powerScale, cutIndex, ...)}, cutSettings: [{index, priority, minPower, maxPower, speed, layerMode, customCutSetting}}]
  //   for shapeSets:
  //     when SHAPE_TYPE_ELIPSE: centerX, centerY, radius
  //     when SHAPE_TYPE_PATH: vectors[], primitives: []
  writeComment(
    'Dump: Project ({groupCount} operation groups):',
    { groupCount: project.operationSets.length },
    COMMENT_DEBUG
  );
  writeComment('  Cut settings:', {}, COMMENT_DEBUG);
  for (let c = 0; c < project.cutSettings.length; ++c) {
    const cutSetting = project.cutSettings[c];
    if (cutSetting.customCutSettingXML)
      writeComment(
        '    #{id}: index={index}, priority={priority}, customCutSettingXML:\n{xml}',
        {
          id: c,
          index: cutSetting.index,
          priority: cutSetting.priority,
          xml: cutSetting.customCutSettingXML,
        },
        COMMENT_DEBUG
      );
    else
      writeComment(
        '    #{id}: {minPower}-{maxPower}% power at {speed} mm/min, index={index}, priority={priority}, layerMode={layerMode}, laserEnable={laserEnable}',
        {
          id: c,
          index: cutSetting.index,
          priority: cutSetting.priority,
          minPower: cutSetting.minPower,
          maxPower: cutSetting.maxPower,
          speed: formatSpeed.format(cutSetting.speed),
          layerMode: cutSetting.layerMode,
          laserEnable: cutSetting.laserEnable,
        },
        COMMENT_DEBUG
      );
  }

  for (let os = 0; os < project.operationSets.length; ++os) {
    writeComment('  Operation group #{id}:', { id: os }, COMMENT_DEBUG);
    for (let o = 0; o < project.operationSets[os].operations.length; ++o) {
      writeComment('    Operation #{id}:', { id: o }, COMMENT_DEBUG);
      writeComment('      Shape groups:', {}, COMMENT_DEBUG);
      for (
        let ss = 0;
        ss < project.operationSets[os].operations[o].shapeSets.length;
        ++ss
      ) {
        const shape = project.operationSets[os].operations[o].shapeSets[ss];

        // dump the shape into insane comments
        writeComment(
          '        Shape (type={type}, cutIndex={cutIndex}, powerScale={powerScale})',
          {
            type: shape.type,
            cutIndex: shape.cutIndex,
            powerScale: shape.powerScale,
          },
          COMMENT_DEBUG
        );
        if (shape.type == SHAPE_TYPE_ELIPSE) {
          writeComment(
            '          Circle center=[{centerX}, {centerY}], radius={radius}',
            {
              centerX: formatPosition.format(shape.centerX),
              centerY: formatPosition.format(shape.centerY),
              radius: formatRadius.format(shape.radius),
            },
            COMMENT_INSANE
          );
        } else {
          writeComment('        Vector list:', {}, COMMENT_INSANE);
          for (let i = 0; i < shape.vectors.length; ++i)
            writeComment(
              '        Vector #{id}: point=[{x}, {y}]{c0}{c1}',
              {
                id: i,
                x: formatPosition.format(shape.vectors[i].x),
                y: formatPosition.format(shape.vectors[i].y),
                c0:
                  shape.vectors[i].c0x !== undefined
                    ? format('c0=[{x}, {y}]', {
                        x: formatPosition.format(shape.vectors[i].c0x),
                        y: formatPosition.format(shape.vectors[i].c0y),
                      })
                    : '',
                c1:
                  shape.vectors[i].c1x !== undefined
                    ? format(', c1=[{x}, {y}]', {
                        x: formatPosition.format(shape.vectors[i].c1x),
                        y: formatPosition.format(shape.vectors[i].c1y),
                      })
                    : '',
              },
              COMMENT_INSANE
            );

          writeComment('        Primitive list:', {}, COMMENT_INSANE);
          for (let i = 0; i < shape.primitives.length; ++i)
            writeComment(
              '          Primitive #{id}: type={type}, start={start}, end={end}',
              {
                id: i,
                type: shape.primitives[i].type,
                start: shape.primitives[i].start,
                end: shape.primitives[i].end,
              },
              COMMENT_INSANE
            );
        }
      }
    }
  }
}
