{% extends 'layout.swig' %}

{% block main-content %}
    {% block source-heading %}
        <h {{ cssClass('page-title') }}>{{ pageTitle }}</h>
    {% endblock %}

    {% block source-content %}
        <section>
            <article>
                {% block source-content-code -%}
                    {%- spaceless %}
                        <pre {{ cssClass('!prettyprint', '!linenums', 'source') }}><code>
                            {{ docs }}
                        </code></pre>
                    {% endspaceless -%}
                {%- endblock %}
            </article>
        </section>
    {% endblock %}
{% endblock %}
