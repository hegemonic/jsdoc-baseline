{% import '../../macros.swig' as macros %}

{% block throws -%}
    {# TODO: may need to incorporate changes from https://github.com/jsdoc3/jsdoc/commit/74ad8efe #}
    {%- spaceless %}
        {% if exceptions && exceptions.length %}
            {% block throws-content %}
                <dl {{ cssClass('block-throws-content') }}>
                    <dt>{{ translate('headings.throws') }}</dt>
                    {% for exception in exceptions %}
                        <dd>
                            {% if exception.type && exception.type.names %}
                                {{ macros.typelist(exception.type.names, 'exception') }}
                            {% endif %}
                            {% include '../description.swig' with exception %}
                        </dd>
                    {% endfor %}
                </dl>
            {% endblock %}
        {% endif %}
    {% endspaceless -%}
{%- endblock %}
