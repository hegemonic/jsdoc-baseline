{% extends 'layout.swig' %}

{% block main-content %}
    <h {{ cssClass('page-title') }}>{{ title }}</h>
    <section>
        <article>
            {% block source -%}
                {%- spaceless %}
                    <pre {{ cssClass('!prettyprint', '!linenums', 'source') }}><code>
                        {{ docs }}
                    </code></pre>
                {% endspaceless -%}
            {%- endblock %}
        </article>
    </section>
{% endblock %}
