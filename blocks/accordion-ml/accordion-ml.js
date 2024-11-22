function multilevelAccordion(mainUL) {
  const mainLIs = mainUL.children;
  for (let i = 0; i < mainLIs.length; i += 1) {
    const mainLI = mainLIs[i];
    const mainA = mainLI.querySelector('a');

    const details = document.createElement('details');
    details.classList.add('accordion-item');

    const summary = document.createElement('summary');
    summary.classList.add('accordion-item-label');
    const labelRight = document.createElement('div');
    labelRight.classList.add('markerdiv');
    const lablDiv = document.createElement('div');
    lablDiv.append(mainA, labelRight);
    summary.append(lablDiv);

    const childUL = mainLI.querySelector('ul');

    if (childUL) {
      details.append(summary, childUL);
      mainLI.replaceWith(details);
      multilevelAccordion(childUL);
    } else {
      details.append(summary);
      mainLI.replaceWith(details);
    }
  }
}

function findLevel(element) {
  let ele = element;
  let level = 0;
  while (ele.parentElement) {
    if (ele.parentElement.tagName === 'UL') {
      level += 1;
    }
    ele = ele.parentElement;
  }
  return level;
}

export default function decorate(block) {
  console.log(block);
  const mainUL = document.querySelector('ul');

  // Get the height of the overall UL for the Mobile view and pass it to the CSS variable

  const divHeight = mainUL.children.length * 46;
  var height = document.querySelector(':root');
  height.style.setProperty('--height', `${divHeight}px`);
  multilevelAccordion(mainUL);
  mainUL.querySelectorAll('details').forEach((details) => {
    details.addEventListener('toggle', (event) => {
      if (event.target.open) {
        const value = findLevel(event.target);
        event.target.querySelector('ul').querySelectorAll(':scope > details').forEach((ele) => {
          ele.querySelector('summary').classList.add(`itemcolor${value + 1}`);
        });
        details.parentElement.querySelectorAll('details').forEach((ele) => {
          if (ele !== event.target) {
            ele.removeAttribute('open');
          }
        });
      }
    });
  });
}