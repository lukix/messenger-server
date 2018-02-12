function validate(object, requiredProps, optionalProps = [], allowExtraProps = false) {
	const allowedPropsNames = [...requiredProps, ...optionalProps]
	const extraPropsError = allowExtraProps
		? null
		: Object.keys(object)
			.every(key => allowedPropsNames.find(({ name }) => name === key) !== undefined)
			? null
			: 'Not expected property found'
	const errorMessages = [
		...requiredProps.map(checkPropertyExistance(object)),
		...requiredProps.map(checkPropertyType(object)),
		...optionalProps.map(checkPropertyType(object)),
		extraPropsError,
	].filter(errorMessage => errorMessage !== null)
	
	return {
		isValid: errorMessages.length === 0,
		errors: errorMessages,
	}
}

const checkPropertyExistance = (object) => ({ name }) => {
	return !object.hasOwnProperty(name)
		? `Required property '${name}' is missing`
		: null
}
const checkPropertyType = (object) => ({ name, type }) => {
	const actualType = typeof object[name]
	return !object.hasOwnProperty(name)
		? null
		: actualType !== type && type !== 'any' && type !== undefined
			? `Invalid type ${actualType} of ${name}. Expected ${type}`
			: null
}

module.exports = validate