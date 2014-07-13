{% extends 'layout.swig' %}

{% block main-content %}
    <h {{ cssclass('page-title') }}>{{ title }}</h>
    <section>
        <article>
            {% block source %}
                <pre {{ cssclass('prettyprint', 'source') }}><code>{{ docs }}</code></pre>
            {% endblock %}
        </article>
    </section>
{% endblock %}
