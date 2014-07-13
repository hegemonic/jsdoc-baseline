{% import '../../macros.swig' as macros %}

{% block fires %}
    {% if fires && fires.length %}
        {% block fires-content %}
            {{ macros.minilist(fires, 'fires', 'Fires', { needsLink: true }) }}
        {% endblock %}
    {% endif %}
{% endblock %}
