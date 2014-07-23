{% import '../../macros.swig' as macros %}

{% block fires %}
    {% if fires && fires.length %}
        {% block fires-content %}
            <dt>{{ translate('headings.fires') }}</dt>
            {{ macros.listitems(fires, { needsLink: true }) }}
        {% endblock %}
    {% endif %}
{% endblock %}
