{% extends 'layout.swig' %}

{% block banner-content %}
    {# TODO #}
{% endblock %}

{% block main-content %}
    {% if package || readme %}
        {% block package-title %}
            {% set context = { package: package } %}
            {% include 'includes/packagetitle.swig' with context only %}
        {% endblock %}

        {# TODO default to a list of modules/classes/namespaces/events/etc. #}
        {# TODO show module descs depending on the config #}
        {% block readme %}
            {% if readme %}
                <article>{{ readme }}</article>
            {% endif %}
        {% endblock %}
    {% endif %}
{% endblock %}
