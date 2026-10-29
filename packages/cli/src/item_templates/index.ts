import { BOOL_TEMPLATE } from './BoolTemplate.js'
import { INT_TEMPLATE } from './IntTemplate.js'
import { FLOAT_TEMPLATE } from './FloatTemplate.js'
import { STRING_TEMPLATE } from './StringTemplate.js'
import { DATETIME_TEMPLATE } from './DatetimeTemplate.js'
import { BYTES_TEMPLATE } from './BytesTemplate.js'
import type { FieldTypeTemplate, SupportedFieldType } from './template_types.js'

const FIELD_TEMPLATES_BY_TYPE: Record<SupportedFieldType, FieldTypeTemplate> = {
    Bool: BOOL_TEMPLATE,
    Int: INT_TEMPLATE,
    Float: FLOAT_TEMPLATE,
    String: STRING_TEMPLATE,
    Datetime: DATETIME_TEMPLATE,
    Bytes: BYTES_TEMPLATE,
}

function get_field_template(strictoType: string): FieldTypeTemplate | undefined {
    return FIELD_TEMPLATES_BY_TYPE[strictoType as SupportedFieldType]
}

export type { FieldTypeTemplate, SupportedFieldType }
export { FIELD_TEMPLATES_BY_TYPE, get_field_template }
