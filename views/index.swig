{% extends 'layout.swig' %}

{% block banner-content %}
    {# TODO #}
{% endblock %}

{% block main-content %}
    {% if package || readme %}
        <section>
            {{ resetHeadingLevel() }}
            {% block package-title %}
                {% include 'includes/packagetitle.swig' %}
            {% endblock %}

            {# TODO default to a list of modules/classes/namespaces/events/etc. #}
            {# TODO show module descs depending on the config #}
            {% block readme %}
                {% if readme %}
                    <article>{{ readme }}</article>
                {% endif %}
            {% endblock %}
        </section>
    {% endif %}
{% endblock %}
