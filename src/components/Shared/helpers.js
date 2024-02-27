export const defineColorHSL = (tag, name, color) => {
  const { r, g, b } = hexToRgb(color)
  const { h, s, l } = rgbToHsl(r, g, b)
  const h_conv = 360 * h,
    s_conv = `${s * 100}%`,
    l_conv = `${l * 100}%`
  tag.style.setProperty(name, `hsl(${h_conv}, ${s_conv}, ${l_conv})`)
  tag.style.setProperty(`${name}-h`, h_conv)
  tag.style.setProperty(`${name}-s`, s_conv)
  tag.style.setProperty(`${name}-l`, l_conv)
}

const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Object           The HSL representation
 */
const rgbToHsl = (r, g, b) => {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h,
    s,
    l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
      default:
        break
    }

    h /= 6
  }

  return { h, s, l }
}

export function titleCase(str) {
  if (!str) return '';
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  return splitStr.join(' '); 
}

// objectExists function is used to check if a given object is not empty 
export function objectExists(obj) {
  return obj && Object.keys(obj).length > 0 && Object.getPrototypeOf(obj) === Object.prototype
}

export function rectifyCaretPositionInMaskedOrFormattedField (e) {
  const caret = e.target.selectionStart
  const element = e.target
  if (caret < e.target.value.length) {
    window.requestAnimationFrame(() => {
      element.selectionStart = caret
      element.selectionEnd = caret
    })
  }
}

export function scrollToElement(element) {
  element.current?.scrollIntoView({behavior: 'smooth', block: "center"});
}

export function clearLocalStorage() {
  let demoMode = Boolean(localStorage.getItem("demo"));
  let organizationId = localStorage.getItem("organizationId");
  let brandLogo = localStorage.getItem("brandLogo");
  localStorage.clear();
  if (demoMode) {
    localStorage.setItem("demo", demoMode);
    if (organizationId) localStorage.setItem("organizationId", organizationId);
  }
  localStorage.setItem("brandLogo", brandLogo);
}

export function calculateMonthsForLength(months, years) {
  months = Number(months);
  years = Number(years) * 12;
  return (months + years);
}

export const processCoApplicantValues = (values) => {
  if(!values.coApplicationMiddleName) values.coApplicationMiddleName = ''
  if(!values.coApplication){
    values.coApplicationFirstName = ''
    values.coApplicationMiddleName = ''
    values.coApplicationLastName = ''
    values.coApplicationEmailAddress = ''
  }
  return values
}