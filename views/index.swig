{% extends 'layout.swig' %}

{% block banner-content %}
    {# TODO #}
{% endblock %}

{% block main-content %}
    {% block package-title %}
        {% if package %}
            <h {{ cssClass('page-title') }}>{{ package.name }} {{ package.version }}</h>
        {% endif %}
    {% endblock %}

    {# TODO default to a list of modules/classes/namespaces/events/etc. #}
    {# TODO show module descs depending on the config #}
    {# TODO: clean up the following #}
    {% block readme %}
        {% if readme %}
            <section>
                <article>{{ readme }}</article>
            </section>
        {% endif %}
    {% endblock %}
{% endblock %}
