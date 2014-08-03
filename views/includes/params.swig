{% import '../macros.swig' as macros %}

{% if params && params.length %}
    {% set params = moveChildren(params) %}
    <h>{{ translate('headings.parameters', params.length) }}</h>
    {{ macros.infoTable(params) }}
{% endif %}
