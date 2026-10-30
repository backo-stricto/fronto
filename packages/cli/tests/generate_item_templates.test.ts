import { describe, expect, it } from 'vitest'
import {
    renderDisplayItemComponent,
    renderInputItemComponent,
    type InputItemApiRoutes,
} from '../src/generate_item_templates.js'
import type { FirItem } from '../src/generate_fir.js'

const INPUT_ROUTES: InputItemApiRoutes = {
    defaultApiBaseUrl: '/api/fronto_toy_app',
    collectionPath: '/product_metrics',
    itemPathTemplate: '/product_metrics/{id}',
    checkPath: '/product_metrics/_check',
    canCreate: true,
    canLoad: true,
    canUpdate: true,
    canCheck: true,
}

describe('generate_item_templates', () => {
    it('uses core scalar default for bool when schema default is invalid', () => {
        const item: FirItem = {
            collectionName: 'feature_flags',
            componentNameBase: 'FeatureFlagsItem',
            fields: [
                {
                    key: 'is_enabled',
                    label: 'Is Enabled',
                    strictoType: 'Bool',
                    required: false,
                    defaultValue: null,
                    writable: true,
                },
            ],
            variants: [],
        }

        const source = renderDisplayItemComponent(item)

        expect(source).toContain('"is_enabled": true')
    })

    it('renders display component for mixed supported types', () => {
        const item: FirItem = {
            collectionName: 'product_metrics',
            componentNameBase: 'ProductMetricsItem',
            fields: [
                {
                    key: 'is_active',
                    label: 'Is Active',
                    strictoType: 'Bool',
                    required: true,
                    defaultValue: true,
                    writable: true,
                },
                {
                    key: 'max_users',
                    label: 'Max Users',
                    strictoType: 'Int',
                    required: true,
                    defaultValue: 500,
                    writable: true,
                },
                {
                    key: 'load_ratio',
                    label: 'Load Ratio',
                    strictoType: 'Float',
                    required: true,
                    defaultValue: 0.75,
                    writable: true,
                },
                {
                    key: 'plan_name',
                    label: 'Plan Name',
                    strictoType: 'String',
                    required: true,
                    defaultValue: 'Pro',
                    writable: true,
                },
                {
                    key: 'release_at',
                    label: 'Release At',
                    strictoType: 'Datetime',
                    required: true,
                    defaultValue: '2026-01-02T03:04:05.000Z',
                    writable: true,
                },
                {
                    key: 'blob_payload',
                    label: 'Blob Payload',
                    strictoType: 'Bytes',
                    required: true,
                    defaultValue: 'Zm9v',
                    writable: true,
                },
            ],
            variants: [],
        }

        const source = renderDisplayItemComponent(item)

        expect(source).toContain("import { resolveFrontoComponent } from '../registry'")
        expect(source).toContain('const FIELD_TYPES: Record<string, SupportedFieldType> =')
        expect(source).toContain('"release_at": "Datetime"')
        expect(source).toContain('"blob_payload": "Bytes"')
        expect(source).toContain(
            "return resolveFrontoComponent(resolveFieldType(fieldKey), 'display')",
        )
        expect(source).toContain(':is="resolveDisplayComponent(fieldKey)"')
    })

    it('renders input component for mixed supported types', () => {
        const item: FirItem = {
            collectionName: 'product_metrics',
            componentNameBase: 'ProductMetricsItem',
            fields: [
                {
                    key: 'is_active',
                    label: 'Is Active',
                    strictoType: 'Bool',
                    required: true,
                    defaultValue: true,
                    writable: true,
                },
                {
                    key: 'max_users',
                    label: 'Max Users',
                    strictoType: 'Int',
                    required: true,
                    defaultValue: 500,
                    writable: true,
                },
                {
                    key: 'load_ratio',
                    label: 'Load Ratio',
                    strictoType: 'Float',
                    required: true,
                    defaultValue: 0.75,
                    writable: false,
                },
                {
                    key: 'plan_name',
                    label: 'Plan Name',
                    strictoType: 'String',
                    required: true,
                    defaultValue: 'Pro',
                    writable: true,
                },
                {
                    key: 'release_at',
                    label: 'Release At',
                    strictoType: 'Datetime',
                    required: true,
                    defaultValue: '2026-01-02T03:04:05.000Z',
                    writable: true,
                },
                {
                    key: 'blob_payload',
                    label: 'Blob Payload',
                    strictoType: 'Bytes',
                    required: true,
                    defaultValue: 'Zm9v',
                    writable: true,
                },
            ],
            variants: [],
        }

        const source = renderInputItemComponent(item, INPUT_ROUTES)

        expect(source).toContain("import { resolveFrontoComponent } from '../registry'")
        expect(source).toContain('"load_ratio": false')
        expect(source).toContain('"release_at": "Datetime"')
        expect(source).toContain('resolveFrontoProps(fieldType, {')
        expect(source).toContain(
            "return resolveFrontoComponent(resolveFieldType(fieldKey), 'input')",
        )
        expect(source).toContain(':is="resolveInputComponent(fieldKey)"')
        expect(source).toContain('@update:value="updateField(fieldKey, $event)"')
    })

    it('ignores unsupported field types', () => {
        const item: FirItem = {
            collectionName: 'legacy',
            componentNameBase: 'LegacyItem',
            fields: [
                {
                    key: 'legacy_ref',
                    label: 'Legacy Ref',
                    strictoType: 'Ref',
                    required: false,
                    defaultValue: null,
                    writable: true,
                },
                {
                    key: 'is_enabled',
                    label: 'Is Enabled',
                    strictoType: 'Bool',
                    required: false,
                    defaultValue: false,
                    writable: true,
                },
            ],
            variants: [],
        }

        const source = renderDisplayItemComponent(item)

        expect(source).toContain('"is_enabled"')
        expect(source).not.toContain('"legacy_ref"')
    })
})
