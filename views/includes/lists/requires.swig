{% import '../../macros.swig' as macros %}

{% block requires %}
    {% if requires && requires.length %}
        {% block requires-content %}
            <dt>Requires</dt>
            {{ macros.listitems(requires, { needsLink: true }) }}
        {% endblock %}
    {% endif %}
{% endblock %}
