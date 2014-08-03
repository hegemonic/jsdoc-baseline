{% import '../../macros.swig' as macros %}

{% if defaultvalue %}
    <dt>{{ translate('headings.defaultValue') }}</dt>
    {# use syntax highlighting for object/array values #}
    {% if defaultvaluetype === 'object' || defaultvaluetype === 'array' %}
        {% set context = { code: defaultvalue } %}
        <dd>{% include '../prettyprint.swig' with context only %}</dd>
    {% else %}
        {{ macros.listItems(defaultvalue) }}
    {% endif %}
{% endif %}
