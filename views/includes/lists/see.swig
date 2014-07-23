{% import '../../macros.swig' as macros %}

{% block see %}
    {% if see && see.length %}
        {% block see-content %}
            <dt>{{ translate('headings.see') }}</dt>
            {{ macros.listitems(see, { needsLink: true }) }}
        {% endblock %}
    {% endif %}
{% endblock %}
