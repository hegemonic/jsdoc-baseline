{% import '../../macros.swig' as macros %}

{% block inherited %}
    {% if inherited && inherits %}
        {% block inherited-content %}
            <dt>Inherited from</dt>
            {{ macros.listitems(inherits, { needsLink: true }) }}
        {% endblock %}
    {% endif %}
{% endblock %}
