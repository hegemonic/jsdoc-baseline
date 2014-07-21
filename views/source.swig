{% extends 'layout.swig' %}

{% block main-content %}
    <h {{ cssclass('page-title') }}>{{ title }}</h>
    <section>
        <article>
            {% block source -%}
            	{%- spaceless %}
                	<pre {{ cssclass('!prettyprint', '!linenums', 'source') }}><code>
                		{{ docs }}
                	</code></pre>
            	{% endspaceless -%}
            {%- endblock %}
        </article>
    </section>
{% endblock %}
