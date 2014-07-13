{% extends 'layout.swig' %}

{% block banner %}{% endblock %}

{% block main-content %}
    <section>
        {% block tutorial-header %}
            <header>
                {% if children && children.length %}
                    <ul>
                    {% for child in children %}
                        <li>{{ tutorialLink(child.name) }}</li>
                    {% endfor %}
                    </ul>
                {% endif %}
                <h>{{ header }}</h>
            </header>
        {% endblock %}
        {% block tutorial-content %}
            <article>
                {{ content }}
            </article>
        {% endblock %}
    </section>
{% endblock %}
