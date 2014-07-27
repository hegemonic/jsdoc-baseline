{% extends 'layout.swig' %}

{% block banner-content %}
    {# TODO #}
{% endblock %}

{% block main-content %}
    {% if package || readme %}
        <section>
            {% resetheadinglevel %}
            {% block package-title %}
                {% if package %}
                    <header {{ cssClass('!page-header') }}>
                        <h {{ cssClass('page-title') }}>{{ package.name }} {{ package.version }}</h>
                    </header>
                {% endif %}
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
