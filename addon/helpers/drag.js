import { registerAsyncHelper } from '@ember/test';
import { find, settled, triggerEvent } from '@ember/test-helpers';
/**
  Drags elements by an offset specified in pixels.

  Examples

      drag(
        'mouse',
        '.some-list li[data-item=uno]',
        function() {
          return { dy: 50, dx: 20 };
        }
      );

  @method drag
  @param {'mouse'|'touch'} [mode]
    event mode
  @param {String} [itemSelector]
    selector for the element to drag
  @param {Function} [offsetFn]
    function returning the offset by which to drag
  @param {Object} [callbacks]
    callbacks that are fired at the different stages of the interaction
  @return {Promise}
*/

export async function drag(mode, itemSelector, offsetFn, callbacks = {}) {
  let start, move, end, which;

  if (mode === 'mouse') {
    start = 'mousedown';
    move = 'mousemove';
    end = 'mouseup';
    which = 1;
  } else if (mode === 'touch') {
    start = 'touchstart';
    move = 'touchmove';
    end = 'touchend';
  } else {
    throw new Error(`Unsupported mode: '${mode}'`);
  }

  await settled();

  let item = find(itemSelector);
  let itemOffset = item.getBoundingClientRect();
  let offset = offsetFn();
  let itemElement = item;
  let rect = itemElement.getBoundingClientRect();
  let scale = itemElement.clientHeight / (rect.bottom - rect.top);
  let halfwayX = itemOffset.left + (offset.dx * scale) / 2;
  let halfwayY = itemOffset.top + (offset.dy * scale) / 2;
  let targetX = itemOffset.left + offset.dx * scale;
  let targetY = itemOffset.top + offset.dy * scale;

  await triggerEvent(item, start, {
    pageX: itemOffset.left,
    pageY: itemOffset.top,
    which
  });

  if (callbacks.dragstart) {
    callbacks.dragstart();
  }

  await triggerEvent(item, move, {
    pageX: itemOffset.left,
    pageY: itemOffset.top
  });

  if (callbacks.dragmove) {
    callbacks.dragmove();
  }

  await triggerEvent(item, move, {
    pageX: halfwayX,
    pageY: halfwayY
  });

  await triggerEvent(item, move, {
    pageX: targetX,
    pageY: targetY
  });

  await triggerEvent(item, end, {
    pageX: targetX,
    pageY: targetY
  });

  if (callbacks.dragend) {
    callbacks.dragend();
  }
}

export default registerAsyncHelper('drag', drag);
