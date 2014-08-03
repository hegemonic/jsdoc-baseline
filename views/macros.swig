{% macro linkList(items, joiner, open, close) -%}
    {%- spaceless %}

    {% set links = [] %}
    {% if items.length > 1 %}
        {% if open === null || open === undefined %}
            {% set open = '(' %}
        {% endif %}
        {% if close === null || close === undefined %}
            {% set close = ')' %}
        {% endif %}
        {% if joiner === null || joiner === undefined %}
            {% set joiner = '&nbsp;| ' %}
        {% endif %}
    {% else %}
        {% set open = '' %}
        {% set close = '' %}
        {% set joiner = '' %}
    {% endif %}

    {% for item in items %}
        {% set links[links.length] = link(item)|safe %}
    {% endfor %}

    {{ open }}
    {{ links|join(joiner)|safe }}
    {{ close }}

    {% endspaceless -%}
{%- endmacro %}

{% macro types(doclet) -%}
    {%- spaceless %}

    {# TODO: offer multiple formats, with a config option #}
    {#
    {% if doclet.type && doclet.type.names && doclet.type.names.length %}
        <span {{ cssClass('type-names') }}>{{ linkList(doclet.type.names) }}</span>
    {% endif %}
    #}

    {% if doclet.type && doclet.type.parsedType %}
        <span {{ cssClass('type-names') }}>{{ describeType(doclet.type.parsedType)|safe }}</span>
    {% endif %}
    {% endspaceless -%}
{%- endmacro %}

{% macro namePrefix(kind) -%}
    {%- spaceless %}
        {% if kind === 'class' %}
            {{ 'new ' }}
        {% endif %}
    {% endspaceless -%}
{%- endmacro %}

{# TODO: can we remove this? #}
{% macro sourceFile(doc) %}
    {% if config('outputSourceFiles') && doc.meta && doc.meta.filename && doc.meta.lineno %}
        <dl {{ cssClass('!dl-compact') }}>
            {% set context = { doc: doc } %}
            {% include 'includes/sourcefile.swig' with context only %}
        </dl>
    {% endif %}
{% endmacro %}

{% macro returnTypes(returns) -%}
    {%- spaceless %}
    {% set types = [] %}
    {% for returned in returns %}
        {% if returned.type && returned.type.names && returned.type.names.length %}
            {% set types = types.concat(returned.type.names) %}
        {% endif %}
    {% endfor %}
    {{ linkList(types) }}
    {% endspaceless -%}
{%- endmacro %}

{% macro signature(doclet) -%}
    {%- spaceless %}
    {% if needsSignature(doclet) %}
        {# TODO: replace <span> tags w/Swig tag that's rendered only when there are 1+ CSS classes #}
        <span {{ cssClass('signature') }}>
            <span {{ cssClass('signature-params') }}>{{ formatParams(doclet.params || []) }}</span>
            {#
                omit the return type for:
                + constructors
                + methods with no explicit return type
            #}
            {% if doclet.kind !== 'class' && doclet.returns && doclet.returns.length %}
                &nbsp;&rarr;
                <span {{ cssClass('signature-returns') }}>{{ returnTypes(doclet.returns) }}</span>
            {% endif %}
        </span>
    {% endif %}
    {% endspaceless -%}
{%- endmacro %}

{% macro maybeLink(item, needsLink) %}
    {% spaceless %}
    {% if needsLink %}
        {{ link(item)|markdownLinks }}
    {% else %}
        {{ item|markdown }}
    {% endif %}
    {% endspaceless -%}
{%- endmacro %}

{% macro listItems(items, options) %}
    {% set options = options || {} %}
    {% if !Array.isArray(items) %}
        {% set items = [items] %}
    {% endif %}
    {# Prevent formatting issues if the list is empty #}
    {% if items.length === 0 %}
        <dd>&nbsp;</dd>
    {% else %}
        {% for item in items %}
            <dd>{{ maybeLink(item, options.needsLink)|resolveLinks }}</dd>
        {% endfor %}
    {% endif %}
{% endmacro %}

{# TODO: fix whitespace #}
{% macro typeList(names) -%}
{%- spaceless %}
    {% for name in names %}
        {% if !loop.first %}
            {% if loop.last && loop.index > 2 %}
                {{ ', or ' }}
            {% elif loop.last %}
                {{ ' or ' }}
            {% else %}
                {{ ', ' }}
            {% endif %}
        {% endif %}
        <span {{ cssClass('type-name') }}>{{ link(name)|safe }}</span>
    {% endfor %}
{% endspaceless -%}
{%- endmacro %}

{# TODO: move to an include? rename classes? #}
{% macro infoTable(data, options) %}
{% set options = options || {} %}
<table {{ cssClass('!jsdoc-details-table') }}>
    <thead>
        <tr>
            <th>{{ translate('tables.header.name') }}</th>
            <th>{{ translate('tables.header.type') }}</th>
            {% if !options.hideOptional %}
                <th>{{ translate('tables.header.optional') }}</th>
            {% endif %}
            <th>{{ translate('tables.header.description') }}</th>
        </tr>
    </thead>
    <tbody>
        {% for item in data %}
            {{ infoRow(item, options) }}
        {% endfor %}
    </tbody>
</table>
{% endmacro %}

{# TODO: break this down a bit #}
{% macro infoRow(item, options) %}
{% if item.type && item.type.parsedType %}
    {% set typeDescription = describeType(item.type.parsedType, { format: 'extended' }) %}
{% endif -%}
<tr>
    {%- spaceless %}
        <td {{ cssClass('details-table-name') }}>
            {% if item.variable -%}
                &hellip;
            {% endif %}
            {% if item.name %}
                {{ item.name }}
            {% else %}
                &#8212;
            {% endif %}
        </td>
        <td {{ cssClass('details-table-types') }}>
            {# TODO: offer multiple formats, with a config option #}
            {#
            {% if item.type && item.type.names %}
                {{ typeList(item.type.names) }}
            {% else %}
                {{ translate('tables.body.unknownType') }}
            {% endif %}
            #}
            {% if typeDescription %}
                <p>{{ typeDescription.description|safe }}</p>
            {% else %}
                {{ translate('tables.body.unknownType') }}
            {% endif %}
        </td>
        {% if !options.hideOptional %}
            <td {{ cssClass('details-table-optional') }}>
                {% if item.optional %}
                    {# TODO: improve #}
                    {{ translate('tables.body.isOptional') }}
                {% else %}
                    {{ translate('tables.body.isRequired') }}
                {% endif %}
            </td>
        {% endif %}
    {% endspaceless -%}
    <td {{ cssClass('details-table-description') }}>
        {{ item.description|resolveLinks|markdown }}
        {# TODO: offer multiple formats, with a config option #}
        {#
        {% if item.nullable === true %}
            <p>{{ translate('tables.body.nullable.long') }}</p>
        {% elif item.nullable === false %}
            <p>{{ translate('tables.body.nonNullable.long') }}</p>
        {% endif %}
        #}
        {% if typeDescription %}
            {% if typeDescription.modifiers.nullable %}
                <p>{{ typeDescription.modifiers.nullable }}</p>
            {% endif %}
            {% if typeDescription.modifiers.repeatable %}
                <p>{{ typeDescription.modifiers.repeatable }}</p>
            {% endif %}
        {% endif %}

        {% if item.defaultvalue && !options.isEnum %}
            <p>{{ translate('tables.body.defaultValue', { value: item.defaultvalue }) }}</p>
        {% endif %}
    </td>
</tr>
{% if item.children %}
    {% for child in item.children %}
        {{ infoRow(child) }}
    {% endfor %}
{% endif %}
{% endmacro %}
