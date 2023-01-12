const getDrivingLicenseCategory = (category) => drivingLicenseCategoryCrmValues[category]

const drivingLicenseCategoryCrmValues = {
  'C': 256, 'D': 258, 'C1': 260, 'D1': 262, 'CE': 264, 'DE': 266, 'C1E': 268, 'D1E': 270, 'B': 440
}

export {
  getDrivingLicenseCategory
}
