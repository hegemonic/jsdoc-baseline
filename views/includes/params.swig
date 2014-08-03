{% import '../macros.swig' as macros %}

{% if doc.params && doc.params.length %}
    {% set doc.params = moveChildren(doc.params) %}
    <h>{{ translate('headings.parameters', doc.params.length) }}</h>
    {{ macros.infoTable(doc.params) }}
{% endif %}
