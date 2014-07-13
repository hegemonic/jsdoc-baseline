{% import '../../macros.swig' as macros %}

{% block copyright %}
    {% if copyright %}
        {% block copyright-content %}
            <dt>Copyright</dt>
            {{ macros.listitems(copyright) }}
        {% endblock %}
    {% endif %}
{% endblock %}
