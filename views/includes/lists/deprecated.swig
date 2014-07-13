{% import '../../macros.swig' as macros %}

{% block deprecated %}
    {% if deprecated %}
        {% block deprecated-content %}
            <dt>Deprecated</dt>
            {{ macros.listitems(deprecated) }}
        {% endblock %}
    {% endif %}
{% endblock %}
