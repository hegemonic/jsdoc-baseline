{% import '../../macros.swig' as macros %}

{% block see %}
    {% if see && see.length %}
        {% block see-content %}
            <dt>See also</dt>
            {{ macros.listitems(see, { needsLink: true }) }}
        {% endblock %}
    {% endif %}
{% endblock %}
