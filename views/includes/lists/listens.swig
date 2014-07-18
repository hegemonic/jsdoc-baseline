{% import '../../macros.swig' as macros %}

{% block listens %}
    {% if listens && listens.length %}
        {% block listens-content %}
            <dt>Listens to</dt>
            {{ macros.listitems(listens, { needsLink: true }) }}
        {% endblock %}
    {% endif %}
{% endblock %}
