{% import '../../macros.swig' as macros %}

{% block requires %}
    {% if requires && requires.length %}
        {% block requires-content %}
            <dt>{{ translate('headings.requires') }}</dt>
            {{ macros.listitems(requires, { needsLink: true }) }}
        {% endblock %}
    {% endif %}
{% endblock %}
