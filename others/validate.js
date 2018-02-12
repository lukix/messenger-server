module.exports = function validate(object, requiredProps, allowExtraProps = false) {
	const extraPropsError = allowExtraProps
		? null
		: Object.keys(object).length <= requiredProps.length
			? null
			: 'Not expected property found'
	const errorMessages = [
		...requiredProps.map(checkProperty(object)),
		extraPropsError,
	].filter(errorMessage => errorMessage !== null)
	
	return {
		isValid: errorMessages.length === 0,
		errors: errorMessages,
	}
}

const checkProperty = (object) => ({ name, type }) => {
	const actualType = typeof object[name]
	return !object.hasOwnProperty(name)
		? `Required property '${name}' is missing`
		: actualType !== type && type !== 'any' && type !== undefined
			? `Invalid type ${actualType} of ${name}. Expected ${type}`
			: null
}