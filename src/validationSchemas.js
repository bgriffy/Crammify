const BaseJOI = require("joi");
const sanitizeHTML = require("sanitize-html");

const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        "string.escapeHTML": "{{#label}} must not include HTML!"
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });
                if (clean !== value) return helpers.error("string.escapeHTML", { value });
                return clean;
            }
        }
    }
});

const Joi = BaseJOI.extend(extension);

module.exports.workspaceValidationSchema = Joi.object({
    workspace: Joi.object({
        title: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewValidationSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(0).max(5),
        noiseLevel: Joi.number().required().min(0).max(3),
        lightingLevel: Joi.number().required().min(0).max(3),
        wifiAvailability: Joi.number().required().min(0).max(3),
        spaceAvailable: Joi.number().required().min(0).max(3),
        body: Joi.string().required().escapeHTML()
    }).required()
});