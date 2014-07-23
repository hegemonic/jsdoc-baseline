{% import '../../macros.swig' as macros %}

{% block inherited %}
    {% if inherited && inherits %}
        {% block inherited-content %}
            <dt>{{ translate('headings.inheritedFrom') }}</dt>
            {{ macros.listitems(inherits, { needsLink: true }) }}
        {% endblock %}
    {% endif %}
{% endblock %}
