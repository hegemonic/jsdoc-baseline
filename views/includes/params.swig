{% import '../macros.swig' as macros %}

{% block params %}
    {% if doc.params && doc.params.length %}
        {% set doc.params = moveChildren(doc.params) %}
        {% block params-content %}
            <h>{{ translate('headings.parameters', doc.params.length) }}</h>
            {{ macros.infotable(doc.params) }}
        {% endblock %}
    {% endif %}
{% endblock %}
