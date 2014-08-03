{%- spaceless %}
    {% if examples && examples.length %}
        {# TODO: maybe make more subtle a la bootstrap docs #}
        <h {{ cssClass('examples') }}>
            {{ translate('headings.examples', examples.length) }}
        </h>
        {% for example in examples %}
            {% set context = { example: example } %}
            {% include 'example.swig' with context %}
        {% endfor %}
    {% endif %}
{% endspaceless -%}
