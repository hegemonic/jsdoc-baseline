{% import '../../macros.swig' as macros %}

{% block license %}
    {% if license %}
        {% block license-content %}
            <dt>License</dt>
            {{ macros.listitems(license) }}
        {% endblock %}
    {% endif %}
{% endblock %}
