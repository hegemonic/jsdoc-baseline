{% macro linklist(items, joiner, open, close) -%}
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

    {% if doclet.type && doclet.type.names && doclet.type.names.length %}
        <span {{ cssClass('type-names') }}>{{ linklist(doclet.type.names) }}</span>
    {% endif %}

    {% endspaceless -%}
{%- endmacro %}

{% macro nameprefix(kind) -%}
    {%- spaceless %}
        {% if kind === 'class' %}
            {{ 'new ' }}
        {% endif %}
    {% endspaceless -%}
{%- endmacro %}

{# TODO: can we remove this? #}
{% macro sourcefile(doc) %}
    {% if config('outputSourceFiles') && doc.meta && doc.meta.filename && doc.meta.lineno %}
        <dl {{ cssClass('!dl-compact') }}>
            {% set context = { doc: doc } %}
            {% include 'includes/sourcefile.swig' with context %}
        </dl>
    {% endif %}
{% endmacro %}

{% macro returntypes(returns) -%}
    {%- spaceless %}
    {% set types = [] %}
    {% for returned in returns %}
        {% if returned.type && returned.type.names && returned.type.names.length %}
            {% set types = types.concat(returned.type.names) %}
        {% endif %}
    {% endfor %}
    {{ linklist(types) }}
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
                <span {{ cssClass('signature-returns') }}>{{ returntypes(doclet.returns) }}</span>
            {% endif %}
        </span>
    {% endif %}
    {% endspaceless -%}
{%- endmacro %}

{% macro maybelink(item, needsLink) %}
    {% spaceless %}
    {% if needsLink %}
        {{ link(item)|markdownLinks }}
    {% else %}
        {{ item|markdown }}
    {% endif %}
    {% endspaceless -%}
{%- endmacro %}

{% macro listitems(items, options) %}
    {% set options = options || {} %}
    {% if !Array.isArray(items) %}
        {% set items = [items] %}
    {% endif %}
    {# Prevent formatting issues if the list is empty #}
    {% if items.length === 0 %}
        <dd>&nbsp;</dd>
    {% else %}
        {% for item in items %}
            <dd>{{ maybelink(item, options.needsLink) }}</dd>
        {% endfor %}
    {% endif %}
{% endmacro %}

{% macro minilist(data, category, listTitle, options) %}
    {% set options = options || {} %}
    {% if options.addWrapper %}
        <dl {{ cssClass(category, 'list-wrapper') }}>
    {% endif %}
    {% if listTitle %}
        <dt>{{ listTitle }}</dt>
    {% endif %}
    {{ listitems(data, options) }}
    {% if options.addWrapper %}
        </dl>
    {% endif %}
{% endmacro %}

{# TODO: fix whitespace #}
{% macro typelist(names) -%}
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
{% macro infotable(data, options) %}
{% block infotable %}
    {% set options = options || {} %}
    <table {{ cssClass('!jsdoc-details-table') }}>
        {% block infotable-head %}
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
        {% endblock %}
        {% block infotable-body %}
        <tbody>
            {% for item in data %}
                {{ inforow(item, options) }}
            {% endfor %}
        </tbody>
        {% endblock %}
    </table>
{% endblock %}
{% endmacro %}

{% macro inforow(item, options) %}
{% block infotable-row %}
<tr>
    {% block item-name -%}
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
        {% endspaceless %}
    {% endblock %}
    {% block item-types -%}
        {%- spaceless %}
        <td {{ cssClass('details-table-types') }}>
            {% if item.type && item.type.names %}
                {{ typelist(item.type.names) }}
            {% else %}
                {{ translate('tables.body.unknownType') }}
            {% endif %}
        </td>
        {% endspaceless %}
    {% endblock %}
    {% block item-optional -%}
        {%- spaceless %}
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
    {%- endblock %}
    {% block item-description %}
        <td {{ cssClass('details-table-description') }}>
            {{ item.description|markdown }}
            {% block item-nullable %}
                {% if item.nullable === true %}
                    {# TODO: formatting #}
                    <p>{{ translate('tables.body.nullable.long') }}</p>
                {% elif item.nullable === false %}
                    {# TODO: formatting #}
                    <p>{{ translate('tables.body.nonNullable.long') }}</p>
                {% endif %}
            {% endblock %}
            {% block item-defaultvalue %}
                {% if item.defaultvalue && !options.isEnum %}
                    {# TODO: formatting #}
                    <p>{{ translate('tables.body.defaultValue', { value: item.defaultvalue }) }}</p>
                {% endif %}
            {% endblock %}
        </td>
    {% endblock %}
</tr>
{% endblock %}
{% block item-children %}
    {% if item.children %}
        {% for child in item.children %}
            {{ inforow(child) }}
        {% endfor %}
    {% endif %}
{% endblock %}
{% endmacro %}
