{% import '../../macros.swig' as macros %}

{% block inherited %}
    {% if inherited && inherits %}
        {% block inherited-content %}
            {{ macros.minilist(inherits, 'inherits', 'Inherited From', true) }}
        {% endblock %}
    {% endif %}
{% endblock %}
