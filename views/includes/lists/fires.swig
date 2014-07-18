{% import '../../macros.swig' as macros %}

{% block fires %}
    {% if fires && fires.length %}
        {% block fires-content %}
            <dt>Fires</dt>
            {{ macros.listitems(fires, { needsLink: true }) }}
        {% endblock %}
    {% endif %}
{% endblock %}
