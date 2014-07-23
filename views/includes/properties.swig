{% import '../macros.swig' as macros %}

{% block properties %}
    {% if properties && properties.length %}
        {% set properties = moveChildren(properties) %}
        {% block properties-content %}
            <h>{{ translate('headings.properties', properties.length) }}</h>
            {{ macros.infotable(properties) }}
        {% endblock %}
    {% endif %}
{% endblock %}
