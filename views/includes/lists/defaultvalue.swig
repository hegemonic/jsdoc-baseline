{% import '../../macros.swig' as macros %}

{% if defaultvalue %}
    {# TODO: incorporate changes from https://github.com/jsdoc3/jsdoc/commit/70109a29 and
        https://github.com/jsdoc3/jsdoc/commit/9af5ea42 #}
    <dt>{{ translate('headings.defaultValue') }}</dt>
    {{ macros.listItems(defaultvalue) }}
{% endif %}
