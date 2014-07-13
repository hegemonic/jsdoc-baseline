{% import '../macros.swig' as macros %}

{% block params %}
    {% if doc.params && doc.params.length %}
        {% set doc.params = moveChildren(doc.params) %}
        {% block params-content %}
            <h>Parameters</h>
            {{ macros.infotable(doc.params) }}
        {% endblock %}
    {% endif %}
{% endblock %}
