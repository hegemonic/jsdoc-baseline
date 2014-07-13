{% import '../../macros.swig' as macros %}

{% block requires %}
    {% if requires && requires.length %}
        {% block requires-content %}
            {{ macros.minilist(requires, 'requires', 'Requires') }}
        {% endblock %}
    {% endif %}
{% endblock %}
