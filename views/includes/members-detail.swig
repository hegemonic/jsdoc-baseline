{% block members-detail %}
    {% if symbolItems && symbolItems.length %}
        {% block symbol-members-detail %}
            <section>
                {% block symbol-members-detail-heading %}
                    <h>{{ translate('headings.' + headingKey, symbolItems.length) }}</h>
                {% endblock %}

                {% block symbol-members-detail-content %}
                    <section>
                        {% for item in symbolItems %}
                            {#
                                TODO: confusing to use 'method.swig' for typedefs/events;
                                also, this logic belongs elsewhere
                            #}
                            {%
                                if containsFunctionType(item.type) || item.kind === 'event' ||
                                    item.kind === 'function'
                            %}
                                {% set context = { doc: item } %}
                                {% include '../method.swig' with context %}
                            {% else %}
                                {% set context = { doc: item } %}
                                {% include '../nonmethod.swig' with context %}
                            {% endif %}
                        {% endfor %}
                    </section>
                {% endblock %}
            </section>
        {% endblock %}
    {% endif %}
{% endblock %}
